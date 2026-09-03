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


/* =========================
   COMPLETE HABIT
========================= */
router.patch("/:id/complete", async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.userId });
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    // save snapshot for undo
    habit.undoSnapshot = {
      streak: habit.streak,
      total: habit.total,
      best: habit.best,
      lastCompletedDate: habit.lastCompletedDate,
      completedToday: habit.completedToday,
      completedDates: [...habit.completedDates],
    };

    const today = new Date().toDateString();

    // date-gap aware streak calculation
    if (!habit.lastCompletedDate) {
      habit.streak = 1;
    } else {
      const diffDays = Math.floor(
        (new Date(today) - new Date(habit.lastCompletedDate)) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === 1) habit.streak++;
      else if (diffDays > 1) habit.streak = 1;
    }

    habit.completedToday = true;
    habit.lastCompletedDate = today;
    habit.total++;
    habit.best = Math.max(habit.best, habit.streak);

    if (!habit.completedDates.includes(today)) {
      habit.completedDates.push(today);
    }

    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* =========================
   UNDO HABIT
========================= */
router.patch("/:id/undo", async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.userId });
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    if (!habit.undoSnapshot) {
      return res.status(400).json({ message: "Undo not available" });
    }

    const s = habit.undoSnapshot;
    habit.streak = s.streak;
    habit.total = s.total;
    habit.best = s.best;
    habit.lastCompletedDate = s.lastCompletedDate;
    habit.completedToday = s.completedToday;
    habit.completedDates = s.completedDates;
    habit.undoSnapshot = null;

    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
