const Booking = require("../models/booking");
const Listing = require("../models/listing");

// CREATE BOOKING (GUEST)
module.exports.createBooking = async (req, res) => {
    const { id } = req.params; // listing id
    const { checkIn, checkOut } = req.body;

    const listing = await Listing.findById(id).populate("owner");

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listing");
    }

    // Host cannot book own listing
    if (listing.owner._id.equals(req.user._id)) {
        req.flash("error", "You cannot book your own listing");
        return res.redirect(`/listing/${id}`);
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (end <= start) {
        req.flash("error", "Invalid booking dates");
        return res.redirect(`/listing/${id}`);
    }

    //  PREVENT DOUBLE BOOKING
    const conflict = await Booking.findOne({
        listing: id,
        status: "confirmed",
        checkIn: { $lt: end },
        checkOut: { $gt: start }
    });

    if (conflict) {
        req.flash(
            "error",
            "These dates are already booked. Please choose different dates."
        );
        return res.redirect(`/listing/${id}`);
    }

    const days =
        (end - start) / (1000 * 60 * 60 * 24);

    const totalPrice = days * listing.price;

    const booking = new Booking({
        listing: id,
        guest: req.user._id,
        host: listing.owner._id, 
        checkIn: start,
        checkOut: end,
        totalPrice,
        status: "confirmed"
    });

    await booking.save();

    req.flash("success", "Booking confirmed!");
    res.redirect("/bookings/my");
};

// GUEST DASHBOARD

module.exports.myBookings = async (req, res) => {
    const bookings = await Booking.find({
        guest: req.user._id
    })
        .populate("listing")
        .sort({ checkIn: -1 });

    res.render("booking/my.ejs", { bookings });
};


// HOST DASHBOARD

module.exports.hostBookings = async (req, res) => {
    const bookings = await Booking.find({
        host: req.user._id
    })
        .populate("listing")
        .populate("guest")
        .sort({ checkIn: -1 });

    res.render("booking/host.ejs", { bookings });
};

// CANCEL BOOKING (GUEST + HOST)

module.exports.cancelBooking = async (req, res) => {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate("listing");

    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect("back");
    }

    const isGuest = booking.guest.equals(req.user._id);
    const isHost = booking.host.equals(req.user._id);

    if (!isGuest && !isHost) {
        req.flash("error", "Unauthorized action");
        return res.redirect("back");
    }

    // Guest rule: cannot cancel after check-in
    if (isGuest) {
        const today = new Date();
        if (today >= booking.checkIn) {
            req.flash("error", "You cannot cancel after check-in");
            return res.redirect("/bookings/my");
        }
    }

    booking.status = "cancelled";
    await booking.save();

    req.flash("success", "Booking cancelled");

    res.redirect(isHost ? "/bookings/host" : "/bookings/my");
};


// HOST CALENDAR

module.exports.hostCalendar = async (req, res) => {

    const bookings = await Booking.find({
        host: req.user._id,
        status: "confirmed"
    })
        .populate("listing")
        .populate("guest");

    res.render("booking/calendar.ejs", { bookings });
};
 