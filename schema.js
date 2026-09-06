const joi = require("joi");
const { CATEGORY_LABELS } = require("./utils/categories.js");

module.exports.listingSchema = joi.object({
  listing: joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().min(0),
    location: joi.string().required(),
    country: joi.string().required(),
    category: joi.string().valid(...CATEGORY_LABELS).default("Trending"),
    image: joi.object({
      url: joi.string().uri().allow("", null),
      filename: joi.string().allow("", null),
    }),
  }).required(),
});

module.exports.reviewSchema = joi.object({
  review: joi.object({
    rating: joi.number().required().min(1).max(5),
    comment: joi.string().required(),
    owner: joi.string().allow("", null),
  }),
});

