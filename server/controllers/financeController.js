const Finance = require("../models/Finance");

/* =========================
   GET ALL FINANCE TRANSACTIONS
========================= */

const getFinance = async (req, res) => {
  try {
    const transactions = await Finance.find({
      user: req.userId,
    }).sort({
      createdAt: -1,
    });
    res.json(transactions);
  } catch (error) {
    console.error("Get finance error:", error);
    res.status(500).json({
      message: "Failed to fetch finance records.",
    });
  }
};

/* =========================
   CREATE TRANSACTION
========================= */

const createFinance = async (req, res) => {
  try {
    const { description, amount, type, category, date } = req.body;

    if (!description || !amount || amount <= 0 || !type || !category) {
      return res.status(400).json({
        message: "Please provide all valid required fields.",
      });
    }

    const transaction = await Finance.create({
      user: req.userId,
      description: description.trim(),
      amount: Number(amount),
      type,
      category,
      date: date || new Date(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Create finance error:", error);
    res.status(500).json({
      message: "Failed to create finance record.",
    });
  }
};

/* =========================
   DELETE TRANSACTION
========================= */

const deleteFinance = async (req, res) => {
  try {
    const transaction = await Finance.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found.",
      });
    }

    res.json({
      message: "Transaction deleted successfully.",
    });
  } catch (error) {
    console.error("Delete finance error:", error);
    res.status(500).json({
      message: "Failed to delete finance record.",
    });
  }
};

module.exports = {
  getFinance,
  createFinance,
  deleteFinance,
};
