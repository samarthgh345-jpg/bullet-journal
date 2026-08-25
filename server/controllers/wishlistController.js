const Wishlist = require("../models/Wishlist");

const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wishlist." });
  }
};

const createWishlistItem = async (req, res) => {
  try {
    const { text, category } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Item text is required." });
    }

    const item = await Wishlist.create({
      user: req.userId,
      text: text.trim(),
      category: category || "buy",
      completed: false,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to create wishlist item." });
  }
};

const updateWishlistItem = async (req, res) => {
  try {
    const { text, category, completed } = req.body;
    const item = await Wishlist.findOne({ _id: req.params.id, user: req.userId });

    if (!item) {
      return res.status(404).json({ message: "Wishlist item not found." });
    }

    if (text !== undefined) item.text = text.trim();
    if (category !== undefined) item.category = category;
    if (completed !== undefined) item.completed = completed;

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to update wishlist item." });
  }
};

const deleteWishlistItem = async (req, res) => {
  try {
    const item = await Wishlist.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!item) {
      return res.status(404).json({ message: "Wishlist item not found." });
    }

    res.json({ message: "Wishlist item deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete wishlist item." });
  }
};

module.exports = {
  getWishlist,
  createWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
};
