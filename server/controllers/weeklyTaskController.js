const WeeklyTask = require("../models/WeeklyTask");

const getWeeklyTasks = async (req, res) => {
  try {
    const tasks = await WeeklyTask.find({ user: req.userId }).sort({ createdAt: 1 });
    // Group by day
    const grouped = {
      monday: [], tuesday: [], wednesday: [], thursday: [],
      friday: [], saturday: [], sunday: [],
    };
    tasks.forEach((t) => {
      if (grouped[t.day]) grouped[t.day].push(t);
    });
    res.json(grouped);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch weekly tasks." });
  }
};

const createWeeklyTask = async (req, res) => {
  try {
    const { text, day } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Task text is required." });
    }
    const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    if (!day || !validDays.includes(day)) {
      return res.status(400).json({ message: "Valid day is required." });
    }
    const task = await WeeklyTask.create({
      user: req.userId,
      text: text.trim(),
      day,
      completed: false,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to create weekly task." });
  }
};

const updateWeeklyTask = async (req, res) => {
  try {
    const { text, completed } = req.body;
    const task = await WeeklyTask.findOne({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Weekly task not found." });
    }
    if (text !== undefined) task.text = text.trim();
    if (completed !== undefined) task.completed = completed;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to update weekly task." });
  }
};

const deleteWeeklyTask = async (req, res) => {
  try {
    const task = await WeeklyTask.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Weekly task not found." });
    }
    res.json({ message: "Weekly task deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete weekly task." });
  }
};

module.exports = { getWeeklyTasks, createWeeklyTask, updateWeeklyTask, deleteWeeklyTask };
