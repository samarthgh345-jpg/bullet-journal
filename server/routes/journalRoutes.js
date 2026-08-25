const express = require("express");
const router = express.Router();
const { clearJournal } = require("../controllers/journalController");
const protect = require("../middleware/authMiddleware");

// Route to clear all journal data for the authenticated user
router.delete("/clear", protect, clearJournal);

module.exports = router;
