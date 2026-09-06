/**
 * STAYNEST — Shared Category Definitions
 * Single source of truth for all listing categories.
 * Used by: Mongoose model, Joi schema, controllers, and views.
 */

const CATEGORIES = [
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

// Plain string list for Mongoose enum and Joi .valid()
const CATEGORY_LABELS = CATEGORIES.map((c) => c.label);

module.exports = { CATEGORIES, CATEGORY_LABELS };
