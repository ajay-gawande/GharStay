const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,isHost,validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});



// index listing route
router.get("/" , 
    wrapAsync(listingController.index)
);

// new listing route  its put above because when client is send request on this url but server 
// get reqest on "/listing/:id" and they take "new" as id so we get the error for that we rigth it above that route

// show New listing creating form
router.get("/new", 
    isLoggedIn, 
    isHost,
    listingController.renderNewListingForm
);


// create listing route // add the listing 
router.post("/",
    isLoggedIn,
    isHost,
    upload.single("listing[image]"), 
    validateListing, 
    wrapAsync(listingController.createNewListing));

 

// show listing
router.get("/:id", 
    wrapAsync(listingController.renderListing)
);

//edit listing form route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditListingForm));

// update listing route
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing)); 

//Delete listing route
router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


module.exports = router;