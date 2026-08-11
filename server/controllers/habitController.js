const Habit = require("../models/Habit");

/* =========================
   GET ALL HABITS
========================= */

const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({
      user: req.userId,
    }).sort({
      createdAt: -1,
    });

    res.json(habits);
  } catch (error) {
    console.error("Get habits error:", error);
    res.status(500).json({
      message: "Failed to fetch habits.",
    });
  }
};

/* =========================
   CREATE HABIT
========================= */

const createHabit = async (req, res) => {
  try {
    const { name, frequency, color } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Habit name is required.",
      });
    }

    const habit = await Habit.create({
      user: req.userId,
      name: name.trim(),
      frequency: frequency || "daily",
      color: color || "#000000",
    });

    res.status(201).json(habit);
  } catch (error) {
    console.error("Create habit error:", error);
    res.status(500).json({
      message: "Failed to create habit.",
    });
  }
};

/* =========================
   UPDATE HABIT
========================= */

const updateHabit = async (req, res) => {
  try {
    const { name, frequency, color } = req.body;

    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found.",
      });
    }

    if (name !== undefined) {
      habit.name = name.trim();
    }

    if (frequency !== undefined) {
      habit.frequency = frequency;
    }

    if (color !== undefined) {
      habit.color = color;
    }

    await habit.save();

    res.json(habit);
  } catch (error) {
    console.error("Update habit error:", error);
    res.status(500).json({
      message: "Failed to update habit.",
    });
  }
};

/* =========================
   TOGGLE HABIT
========================= */

const toggleHabit = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({
        message: "Date is required.",
      });
    }

    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found.",
      });
    }

    const index = habit.completedDates.indexOf(date);

    if (index === -1) {
      habit.completedDates.push(date);
    } else {
      habit.completedDates.splice(index, 1);
    }

    await habit.save();

    res.json(habit);
  } catch (error) {
    console.error("Toggle habit error:", error);
    res.status(500).json({
      message: "Failed to update habit.",
    });
  }
};

/* =========================
   DELETE HABIT
========================= */

const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found.",
      });
    }

    res.json({
      message: "Habit deleted successfully.",
    });
  } catch (error) {
    console.error("Delete habit error:", error);
    res.status(500).json({
      message: "Failed to delete habit.",
    });
  }
};

module.exports = {
  getHabits,
  createHabit,
  updateHabit,
  toggleHabit,
  deleteHabit,
};
