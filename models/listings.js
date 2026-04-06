const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const CATEGORIES = [
  "Trending",
  "Rooms",
  "Beachfront",
  "Cabins",
  "Castles",
  "Camping",
  "Arctic",
  "Pools",
  "Countryside",
  "Luxury",
  "City",
  "Farms",
];

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String, 
  image: {
     filename:{
    type: String,
    default:"wanderlust_lala",
  },
    url:{ 
      type:String,
       default:"https://images.unsplash.com/photo-1526779259212-939e64788e3c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1174",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1526779259212-939e64788e3c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1174"
        : v
      },
 
  },
  category: {
    type: String,
    enum: CATEGORIES,
    default: "Trending",
  },
  price: Number,
  location: String,
  country: String,
  reviews:[{
    type:Schema.Types.ObjectId,
    ref:"review",
  }],
   owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

// schema.js
// const Joi = require("joi");

// module.exports.listingSchema = Joi.object({
//   listing: Joi.object({
//     title: Joi.string().required(),
//     description: Joi.string().allow(""),
//     price: Joi.number().required().min(0),
//     location: Joi.string().required(),
//     country: Joi.string().required(),
//     image: Joi.object({
//       url: Joi.string().uri().allow(""),
//       filename: Joi.string().allow(""),
//     }).optional(),
//   }).required(),
// });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing; 
// 
