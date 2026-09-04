const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isGuest, isHost } = require("../middleware");
const bookingController = require("../controllers/bookings");


// GUEST ROUTES

// Create booking (from listing)
router.post(
    "/",
    isLoggedIn,
    isGuest,
    wrapAsync(bookingController.createBooking)
);

// Guest bookings dashboard
router.get(
    "/my",
    isLoggedIn,
    isGuest,
    wrapAsync(bookingController.myBookings)
);

// Cancel booking (guest or host – logic in controller)
router.delete(
    "/:id",
    isLoggedIn,
    wrapAsync(bookingController.cancelBooking)
);



// HOST ROUTES


// Host bookings dashboard
router.get(
    "/host",
    isLoggedIn,
    isHost,
    wrapAsync(bookingController.hostBookings)
);

// Host calendar view
router.get(
    "/host/calendar",
    isLoggedIn,
    isHost,
    wrapAsync(bookingController.hostCalendar)
);

module.exports = router;
