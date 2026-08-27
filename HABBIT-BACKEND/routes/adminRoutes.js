const express = require("express");
const User = require("../models/User");
const Habit = require("../models/Habit");

const router = express.Router();

/* =========================
   GET ALL USERS
========================= */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* =========================
   DELETE A USER (+ their habits)
========================= */
router.delete("/users/:id", async (req, res) => {
  try {
    await Habit.deleteMany({ user: req.params.id });
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User and their habits deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* =========================
   APP-WIDE STATS
========================= */
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalHabits = await Habit.countDocuments();
    const categoryBreakdown = await Habit.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    res.json({ totalUsers, totalHabits, categoryBreakdown });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;