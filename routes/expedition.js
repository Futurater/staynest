/**
 * STAYNEST — EXPEDITION ROUTES (SQL POWERED)
 * Multi-Leg Architectural Expeditions Engine
 */

const express = require("express");
const router = express.Router();
const sql = require("../database/sql.js");
const wrapAsync = require("../utils/wrapAsync.js");

// INDEX: View all multi-leg architectural expeditions
router.get("/", wrapAsync(async (req, res) => {
  const expeditions = sql.getAllExpeditions();
  res.render("expeditions/index.ejs", { expeditions });
}));

// SHOW: View a specific expedition itinerary with transit legs
router.get("/:slug", wrapAsync(async (req, res) => {
  const { slug } = req.params;
  const expedition = sql.getExpeditionBySlug(slug);

  if (!expedition) {
    req.flash("error", "Architectural expedition not found.");
    return res.redirect("/expeditions");
  }

  res.render("expeditions/show.ejs", { expedition });
}));

// BOOK: Single-click unified booking for all legs
router.post("/:slug/book", wrapAsync(async (req, res) => {
  const { slug } = req.params;
  const expedition = sql.getExpeditionBySlug(slug);

  if (!expedition) {
    req.flash("error", "Expedition not found.");
    return res.redirect("/expeditions");
  }

  const userName = req.user ? req.user.username : (req.body.travelerName || "Guest Explorer");
  const checkIn = req.body.startDate || "2026-10-20";
  
  // Calculate departure date by adding expedition duration days
  const startDateObj = new Date(checkIn);
  startDateObj.setDate(startDateObj.getDate() + expedition.duration_days);
  const checkOut = startDateObj.toISOString().split("T")[0];

  const baseAmount = expedition.bundle_price;
  const taxAmount = Math.round(baseAmount * 0.18);
  const totalAmount = baseAmount + taxAmount;

  // Commit booking atomically to our SQL transactional ledger
  const bookingRef = sql.recordBooking({
    userName,
    listingTitle: `[EXPEDITION] ${expedition.title}`,
    checkIn,
    checkOut,
    nights: expedition.duration_days,
    baseAmount,
    taxAmount,
    totalAmount,
  });

  req.flash("success", `Expedition booked! Itinerary reference: ${bookingRef}. All ${expedition.legs.length} legs synchronized.`);
  res.redirect(`/expeditions/${slug}`);
}));

module.exports = router;
