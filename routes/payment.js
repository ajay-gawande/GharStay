const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isGuest } = require("../middleware");
const paymentController = require("../controllers/payments");

router.post(
    "/listing/:id/checkout",
    isLoggedIn,
    isGuest,
    wrapAsync(paymentController.createCheckoutSession)
);

router.get(
    "/payment/success/:id",
    wrapAsync(paymentController.paymentSuccess)
);

router.get(
    "/payment/cancel/:id",
    wrapAsync(paymentController.paymentCancel)
);

module.exports = router;
