const Listing = require('./models/listing.js');
const Review = require('./models/reviews.js');
const { listingSchema, reviewSchema} = require("./schema.js"); // validations
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedIn = (req,res,next) =>{
    
      if(!req.isAuthenticated()){
       if(req.method == "GET"){
         req.session.redirectUrl = req.originalUrl;
       }
        req.flash("error","Login must required")
        return res.redirect("/login")
    } 
    next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error",`You don't have permission`);
        return res.redirect(`/listing/${id}`);
    }

    next();
}

module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body,{ convert: true });
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        console.log(errMsg);
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res, next) =>{
    let { error } = reviewSchema.validate(req.body);
    if(error){
        let newErr =error.details.map((el) => el.message).join(",");
        console.log(newErr);
        throw new ExpressError(400,newErr);
    } else{
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewid } = req.params;
    let review = await Review.findById(reviewid);

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission");
        return res.redirect(`/listing/${id}`);
    }
    next();
};


module.exports.isHost = (req, res, next) => {
    if (req.user.role !== "host") {
        req.flash("error", "Only hosts can perform this action");
        return res.redirect("/listing");
    }
    next();
};

module.exports.isGuest = (req, res, next) => {
    if (req.user.role !== "guest") {
        req.flash("error", "Only guests can do this action");
        return res.redirect("/listing");
    }
    next();
};


module.exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        req.flash("error", "Admin access only");
        return res.redirect("/listing");
    }
    next();
};

