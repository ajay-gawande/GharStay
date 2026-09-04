const Listing = require("../models/listing.js");
const Booking = require("../models/booking"); 
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
};

module.exports.renderNewListingForm = (req, res) => {
    res.render("listing/new.ejs");
};

module.exports.createNewListing = async (req, res) => {
    if (!req.file) {
        req.flash("error", "Image is required");
        return res.redirect("/listing/new");
    }

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = {
        type: "Point",
        coordinates: [
            req.body.listing.geometry.coordinates[0], // lng
            req.body.listing.geometry.coordinates[1]  // lat
        ]
    };

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect(`/listing/${newListing._id}`);
};


module.exports.renderListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id)
        .populate({
            path: "review",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listing");
    }

    //  FETCH CONFIRMED BOOKINGS FOR CALENDAR
    const bookings = await Booking.find({
        listing: id,
        status: "confirmed"
    });

    res.render("listing/show.ejs", {
        listing,
        bookings 
    });
};



module.exports.renderEditListingForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listing");
    }

    let originalImage = listing.image.url.replace("upload", "upload/h_100");
    res.render("listing/edit.ejs", { listing, originalImage });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true, runValidators: true }
    );

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");
};
