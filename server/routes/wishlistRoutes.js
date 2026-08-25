const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getWishlist,
  createWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
} = require("../controllers/wishlistController");

const router = express.Router();

router.get("/", protect, getWishlist);
router.post("/", protect, createWishlistItem);
router.put("/:id", protect, updateWishlistItem);
router.delete("/:id", protect, deleteWishlistItem);

module.exports = router;
