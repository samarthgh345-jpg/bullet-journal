const Task = require("../models/Task");
const Habit = require("../models/Habit");
const Finance = require("../models/Finance");
const Note = require("../models/Note");
const WishlistItem = require("../models/Wishlist");
const Event = require("../models/Event");
const Goal = require("../models/Goal");
const WeeklyTask = require("../models/WeeklyTask");

/* =========================
   CLEAR ENTIRE JOURNAL
======================================== */
const clearJournal = async (req, res) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ message: "Not authorized to clear journal" });
    }

    // Delete all records associated with this user across all collections
    await Promise.all([
      Task.deleteMany({ user: userId }),
      Habit.deleteMany({ user: userId }),
      Finance.deleteMany({ user: userId }),
      Note.deleteMany({ user: userId }),
      WishlistItem.deleteMany({ user: userId }),
      Event.deleteMany({ user: userId }),
      Goal.deleteMany({ user: userId }),
      WeeklyTask.deleteMany({ user: userId }),
    ]);

    res.json({ message: "Journal cleared successfully." });
  } catch (error) {
    console.error("Error clearing journal:", error);
    res.status(500).json({ message: "Failed to clear journal data." });
  }
};

module.exports = {
  clearJournal,
};
