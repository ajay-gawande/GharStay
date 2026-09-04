console.log("✅ user routes loaded");

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController = require("../controllers/users.js");



// signup
router.get("/signup", userController.renderSignupForm);
router.post("/signup", wrapAsync(userController.signup));

// login
router.get("/login", userController.renderLoginForm);

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    userController.login
);

// logout
router.get("/logout", userController.logout);

// become host
router.get("/become-host", isLoggedIn, async (req, res) => {
    req.user.role = "host";
    await req.user.save();
    req.flash("success", "You are now a host!");
    res.redirect("/listing/new");
});

module.exports = router;
