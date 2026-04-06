// utils/isOwner.js
const Listing = require("../models/listings.js");

module.exports = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  // if no owner (older records), deny safely
  if (!listing.owner) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }
  // compare as strings (safe)
  if (listing.owner.toString() !== req.user._id.toString()) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
