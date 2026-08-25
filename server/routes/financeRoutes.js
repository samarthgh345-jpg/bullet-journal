const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getFinance,
  createFinance,
  deleteFinance,
} = require("../controllers/financeController");

const router = express.Router();

router.get("/", protect, getFinance);
router.post("/", protect, createFinance);
router.delete("/:id", protect, deleteFinance);

module.exports = router;
