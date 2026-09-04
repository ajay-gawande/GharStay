const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },

    guest: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // REQUIRED for Host Calendar & Dashboard
    host: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    checkIn: {
        type: Date,
        required: true
    },

    checkOut: {
        type: Date,
        required: true
    },

    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },

    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "confirmed"
    },

    // Stripe
    paymentIntentId: {
        type: String
    },

    paid: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
