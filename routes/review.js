const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isGuest, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js");


// add review 
router.post('/', isLoggedIn,isGuest, validateReview, wrapAsync(reviewController.addReview));

// delete review
router.delete("/:reviewid",isLoggedIn,isGuest,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
 