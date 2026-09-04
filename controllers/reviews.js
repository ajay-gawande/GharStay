const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.addReview = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listing");
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    await newReview.save();

    listing.review.push(newReview._id);
    await listing.save();

    req.flash("success", "Review added!");
    res.redirect(`/listing/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    const { id, reviewid } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { review: reviewid }
    });

    await Review.findByIdAndDelete(reviewid);

    req.flash("success", "Review deleted!");
    res.redirect(`/listing/${id}`);
};
