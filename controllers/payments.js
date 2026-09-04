const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/booking");
const Listing = require("../models/listing");


 // CREATE CHECKOUT SESSION

module.exports.createCheckoutSession = async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listing");
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    //  Minimum 1 night
    let days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (days <= 0) days = 1;

    const totalPrice = days * listing.price;

    //  Create booking FIRST (pending)
    const booking = new Booking({
        listing: id,
        guest: req.user._id,
        host: listing.owner,
        checkIn: start,
        checkOut: end,
        totalPrice,
        status: "pending",
        paid: false
    });

    await booking.save();

    //  Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: listing.title
                    },
                    unit_amount: totalPrice * 100 // paise
                },
                quantity: 1
            }
        ],
        success_url: `${req.protocol}://${req.get("host")}/payment/success/${booking._id}`,
        cancel_url: `${req.protocol}://${req.get("host")}/payment/cancel/${booking._id}`
    });

    // Save Stripe session id
    booking.paymentIntentId = session.id;
    await booking.save();

    res.redirect(session.url);
};


 // PAYMENT SUCCESS (VERIFY WITH STRIPE)
 
module.exports.paymentSuccess = async (req, res) => {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect("/");
    }

    // Ownership check
    if (!booking.guest.equals(req.user._id)) {
        req.flash("error", "Unauthorized access");
        return res.redirect("/");
    }

    // Prevent double confirmation
    if (!booking.paid) {
        const session = await stripe.checkout.sessions.retrieve(
            booking.paymentIntentId
        );

        if (session.payment_status === "paid") {
            booking.paid = true;
            booking.status = "confirmed";
            await booking.save();

            req.flash("success", "Payment successful! Booking confirmed.");
        } else {
            req.flash("error", "Payment not completed.");
        }
    }

    res.redirect("/bookings/my");
};


 // PAYMENT CANCEL (SAFE)
 
module.exports.paymentCancel = async (req, res) => {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (booking && !booking.paid) {
        booking.status = "cancelled";
        await booking.save();
    }

    req.flash("error", "Payment cancelled.");
    res.redirect("/listing");
};
