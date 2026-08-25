const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getWeeklyTasks, createWeeklyTask, updateWeeklyTask, deleteWeeklyTask } = require("../controllers/weeklyTaskController");

const router = express.Router();

router.get("/", protect, getWeeklyTasks);
router.post("/", protect, createWeeklyTask);
router.put("/:id", protect, updateWeeklyTask);
router.delete("/:id", protect, deleteWeeklyTask);

module.exports = router;
