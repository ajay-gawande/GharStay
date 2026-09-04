const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.dashboard = async (req, res) => {
    const users = await User.countDocuments();
    const listings = await Listing.countDocuments();
    const bookings = await Booking.countDocuments();

    res.render("admin/dashboard.ejs", {
        users,
        listings,
        bookings
    });
};

module.exports.users = async (req, res) => {
    const users = await User.find({});
    res.render("admin/users.ejs", { users });
};

module.exports.listings = async (req, res) => {
    const listings = await Listing.find({}).populate("owner");
    res.render("admin/listings.ejs", { listings });
};

module.exports.bookings = async (req, res) => {
    const bookings = await Booking.find({})
        .populate("listing")
        .populate("guest")
        .populate("host");

    res.render("admin/bookings.ejs", { bookings });
};

module.exports.deleteListing = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing removed by admin");
    res.redirect("/admin/listings");
};
