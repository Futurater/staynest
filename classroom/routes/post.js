const express = require("express");
const router = express.Router();

// Index Route — GET all posts
router.get("/", (req, res) => {
  res.send("GET for posts");
});

// Show Route — GET one post by ID
router.get("/:id", (req, res) => {
  res.send("GET for post id");
});

// POST Route — Create a new post
router.post("/", (req, res) => {
  res.send("POST for posts");
});

// DELETE Route — Delete a post by ID
router.delete("/:id", (req, res) => {
  res.send("DELETE for post id");
});

module.exports = router;
