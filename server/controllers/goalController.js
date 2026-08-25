const Goal = require("../models/Goal");

const getGoals = async (req, res) => {
  try {
    const { scope } = req.query;
    const filter = { user: req.userId };
    if (scope) filter.scope = scope;
    const goals = await Goal.find(filter).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch goals." });
  }
};

const createGoal = async (req, res) => {
  try {
    const { text, scope } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Goal text is required." });
    }
    if (!scope || !["monthly", "weekly"].includes(scope)) {
      return res.status(400).json({ message: "Valid scope (monthly/weekly) is required." });
    }
    const goal = await Goal.create({
      user: req.userId,
      text: text.trim(),
      scope,
      completed: false,
    });
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: "Failed to create goal." });
  }
};

const updateGoal = async (req, res) => {
  try {
    const { text, completed } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, user: req.userId });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found." });
    }
    if (text !== undefined) goal.text = text.trim();
    if (completed !== undefined) goal.completed = completed;
    await goal.save();
    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: "Failed to update goal." });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found." });
    }
    res.json({ message: "Goal deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete goal." });
  }
};

module.exports = { getGoals, createGoal, updateGoal, deleteGoal };
