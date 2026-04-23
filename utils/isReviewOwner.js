// utils/isReviewOwner.js
const Review = require("../models/review.js");

module.exports = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  
  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }
  
  // if no owner (older records), deny safely
  if (!review.owner) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }
  
  // compare as strings (safe)
  if (review.owner.toString() !== req.user._id.toString()) {
    req.flash("error", "You don't have permission to delete this review!");
    return res.redirect(`/listings/${id}`);
  }
  
  next();
};
