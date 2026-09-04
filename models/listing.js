const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");

const listingScheam = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    review: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true
        }
    }
});

listingScheam.post("findOneAndDelete", async (listing) => {
    if (listing && listing.review.length) {
        await Review.deleteMany({ _id: { $in: listing.review } });
    }
});

module.exports = mongoose.model("Listing", listingScheam);
