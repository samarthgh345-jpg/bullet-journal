const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getHabits,
  createHabit,
  updateHabit,
  toggleHabit,
  deleteHabit,
} = require("../controllers/habitController");

const router = express.Router();

router.get("/", protect, getHabits);
router.post("/", protect, createHabit);
router.put("/:id", protect, updateHabit);
router.post("/:id/toggle", protect, toggleHabit);
router.delete("/:id", protect, deleteHabit);

module.exports = router;
