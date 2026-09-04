const User = require('../models/user.js');

module.exports.renderSignupForm = (req, res) => {
    res.render("./user/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({
            username,
            email,
            role: "guest"
        });

        const registerUser = await User.register(newUser, password);

        req.login(registerUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Register Successfully!");
            res.redirect("/listing");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("./user/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success", `Welcome back ${req.body.username}!`);
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "Logged out!");
        res.redirect("/listing");
    });
};
