if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const session = require("express-session");
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require('./routes/user.js');
const bookingRoutes = require("./routes/booking");
const paymentRoutes = require("./routes/payment");
const adminRoutes = require("./routes/admin.js")
const LocalStrategy = require("passport-local");
const passport = require("passport");
const User = require('./models/user.js');




app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));


const mongo_url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/airbnb";


main().then(()=>{
    console.log("Database Connected");
}).catch((err) =>{
    console.log(err);
});

async function main() {
    await mongoose.connect(mongo_url);    
};


const sessionOption = {
    secret: process.env.SESSION_SECRET || "fallbacksecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use((req,res,next) => {
    console.log("REQ:", req.method, req.originalUrl);
    next();
});

app.use((req, res, next) => {
    if (
        req.method === "GET" &&
        !["/login", "/signup"].includes(req.path) &&
        !req.path.startsWith("/favicon") &&
        !req.path.startsWith("/.well-known")
    ) {
        req.session.redirectUrl = req.originalUrl;
    }
    next();
});

app.use((req, res, next) => {
    if (req.path.startsWith("/.well-known")) {
        return res.sendStatus(204);
    }
    next();
});

// router
app.use("/listing",listingRouter);
app.use('/listing/:id/review', reviewsRouter)
app.use('/',userRouter);
app.use("/bookings", bookingRoutes);
app.use("/",paymentRoutes);
app.use("/admin",adminRoutes);




app.use((req, res, next) => {
    console.log("404 HIT FOR:", req.method, req.originalUrl);
    next(new ExpressError(404,"Page Not Found!"))
})


app.use((err,req,res,next) =>{
    console.error(err.stack);
    let{ statusCode=500, message="some error"} = err;
    res.status(statusCode).render("error.ejs",{message})
});

app.listen(8080,() =>{
    console.log("server start listening");
});
