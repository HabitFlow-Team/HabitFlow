require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// AUTH routes (register/login) — open to everyone
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// HABITS routes — protected, needs login
const habitRoutes = require("./routes/habitRoutes");
const protect = require("./middleware/auth");
app.use("/api/habits", protect, habitRoutes);

// ADMIN routes — protected, needs login + isAdmin true
const adminRoutes = require("./routes/adminRoutes");
const requireAdmin = require("./middleware/admin");
app.use("/api/admin", protect, requireAdmin, adminRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

app.get("/", (req, res) => {
  res.send("HabitFlow backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));