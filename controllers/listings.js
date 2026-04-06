const Listing=require("../models/listings.js")
const FILTER_OPTIONS = [
  { label: "Trending", icon: "fa-fire" },
  { label: "Rooms", icon: "fa-bed" },
  { label: "Beachfront", icon: "fa-umbrella-beach" },
  { label: "Cabins", icon: "fa-tree" },
  { label: "Castles", icon: "fa-chess-rook" },
  { label: "Camping", icon: "fa-campground" },
  { label: "Arctic", icon: "fa-snowflake" },
  { label: "Pools", icon: "fa-person-swimming" },
  { label: "Countryside", icon: "fa-mountain" },
  { label: "Luxury", icon: "fa-gem" },
  { label: "City", icon: "fa-city" },
  { label: "Farms", icon: "fa-tractor" },
];


module.exports.index=async (req, res) => {
  const requestedCategory = req.query.category;
  const isValidCategory = FILTER_OPTIONS.some(
    (option) => option.label === requestedCategory
  );
  const selectedCategory = isValidCategory ? requestedCategory : "";
  const query = selectedCategory ? { category: selectedCategory } : {};
  const allListings = await Listing.find(query);
  res.render("listings/index", { allListings, selectedCategory, filterOptions: FILTER_OPTIONS });
}

module.exports.renderNewForm=(req, res) => {
  res.render("listings/new", { categories: FILTER_OPTIONS.map((option) => option.label) });
}

module.exports.createNewListing=async (req, res) => {
  const newListing = new Listing(req.body.listing);

  if (req.file) {
    const url = req.file.path;
    const filename = req.file.filename;
    newListing.image = { url, filename };
  }
  newListing.owner = req.user._id; // attach logged-in user as owner
  await newListing.save();
  req.flash("success", "New Listing created");
  res.redirect("/listings");
}

module.exports.showListing=async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews").populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
}

module.exports.editListing=async (req, res) => {
  
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/edit", {
    listing,
    categories: FILTER_OPTIONS.map((option) => option.label),
  });
}

module.exports.updateListing=async (req, res) => {
  const { id } = req.params;
 let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename}
    await listing.save();
  }
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
}
