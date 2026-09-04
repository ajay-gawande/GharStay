const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isAdmin } = require("../middleware");
const adminController = require("../controllers/admin");

// Dashboard
router.get(
    "/",
    isLoggedIn,
    isAdmin,
    wrapAsync(adminController.dashboard)
);

// Users
router.get(
    "/users",
    isLoggedIn,
    isAdmin,
    wrapAsync(adminController.users)
);

// Listings
router.get(
    "/listings",
    isLoggedIn,
    isAdmin,
    wrapAsync(adminController.listings)
);

// Bookings
router.get(
    "/bookings",
    isLoggedIn,
    isAdmin,
    wrapAsync(adminController.bookings)
);

// Delete listing
router.delete(
    "/listing/:id",
    isLoggedIn,
    isAdmin,
    wrapAsync(adminController.deleteListing)
);

module.exports = router;
