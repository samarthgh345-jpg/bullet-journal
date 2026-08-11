const Task = require("../models/Task");

/* =========================
   GET ALL TASKS
========================= */

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.userId,
    }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      message: "Failed to fetch tasks.",
    });
  }
};

/* =========================
   CREATE TASK
========================= */

const createTask = async (req, res) => {
  try {
    const { title, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required.",
      });
    }

    const task = await Task.create({
      user: req.userId,
      title: title.trim(),
      priority: priority || "medium",
      dueDate: dueDate || null,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      message: "Failed to create task.",
    });
  }
};

/* =========================
   UPDATE TASK
========================= */

const updateTask = async (req, res) => {
  try {
    const { title, completed, priority, dueDate } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    if (title !== undefined) {
      task.title = title.trim();
    }
    if (completed !== undefined) {
      task.completed = completed;
    }
    if (priority !== undefined) {
      task.priority = priority;
    }
    if (dueDate !== undefined) {
      task.dueDate = dueDate || null;
    }

    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      message: "Failed to update task.",
    });
  }
};

/* =========================
   DELETE TASK
========================= */

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    res.json({
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      message: "Failed to delete task.",
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
