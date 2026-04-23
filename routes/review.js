const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const reviewController = require("../controllers/review.js");
const isLoggedIn = require("../utils/isLoggedIn.js");

const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }  
};

//review
//POST
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//DELETE
const isReviewOwner = require("../utils/isReviewOwner.js");
router.delete("/:reviewId", isLoggedIn, isReviewOwner, wrapAsync(reviewController.deleteReview));

module.exports=router;
