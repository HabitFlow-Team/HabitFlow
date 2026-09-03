const express = require("express");
const Habit = require("../models/Habit");

const router = express.Router();

/* =========================
   GET ALL HABITS (current user)
========================= */
router.get("/", async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.userId }).sort({ createdAt: 1 });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});