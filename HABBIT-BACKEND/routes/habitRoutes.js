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

/* =========================
   CREATE HABIT
========================= */
router.post("/", async (req, res) => {
  try {
    // Get habit data from request body
    const { name, category, time } = req.body;

    // Validate habit name
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Habit name is required" });
    }

    // Clean and capitalize habit name
    const cleanName = name.trim();
    const capitalized =
      cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    // Check if the same habit already exists for this user
    const existing = await Habit.findOne({
      user: req.userId,
      name: { $regex: `^${capitalized}$`, $options: "i" },
    });

    if (existing) {
      return res.status(400).json({ message: "Habit already exists" });
    }

    // Create and save the habit
    const habit = await Habit.create({
      user: req.userId,
      name: capitalized,
      category: category || "other",
      time: time || "",
    });

    // Return the created habit
    res.status(201).json(habit);
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: "Server error", error: err.message });
  }
});