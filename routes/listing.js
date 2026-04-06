// routes/listing.js
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer')

const {storage}=require("../cloudconfig.js")
const upload = multer({storage})

const isLoggedIn = require("../utils/isLoggedIn.js");
const isOwner = require("../utils/isOwner.js");

// validateListing middleware (same idea you had)
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

// INDEX - list all
router
  .route("/")
  .get( wrapAsync(listingController.index))
  .post(isLoggedIn, 
    upload.single('listing[image]'),
    validateListing,

 wrapAsync(listingController.createNewListing)
)

router.get("/new", isLoggedIn, listingController.renderNewForm);



router.route("/:id")
  .get( wrapAsync(listingController.showListing))
  .put( isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
  .delete( isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));
// NEW - show form (only logged-in)




// EDIT - show edit form (only owner)
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

// UPDATE - update listing (only owner)


// DELETE - delete listing (only owner)


module.exports = router;

