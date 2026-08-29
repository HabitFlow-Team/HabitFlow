/**
 * ============================================================
 * HabitFlow — Achievement Definitions
 * ------------------------------------------------------------
 * Single source of truth for all achievement metadata.
 *
 * This file contains WHAT an achievement is.
 * Unlock logic lives separately in achievements.js.
 * ============================================================
 */

const ACHIEVEMENTS = [

  /* =========================================================
     HABIT ACHIEVEMENTS
  ========================================================= */

  {
    id: "first-spark",
    name: "First Spark",
    description: "Complete your first habit.",
    icon: "local_fire_department",
    category: "habit",
    type: "total-completions",
    requirement: 1,
    points: 10,
  },

  {
    id: "habit-builder",
    name: "Habit Builder",
    description: "Complete 50 habits and keep moving forward.",
    icon: "checklist",
    category: "habit",
    type: "total-completions",
    requirement: 50,
    points: 50,
  },

  {
    id: "habit-master",
    name: "Habit Master",
    description: "Complete 100 habits.",
    icon: "workspace_premium",
    category: "habit",
    type: "total-completions",
    requirement: 100,
    points: 100,
  },


  /* =========================================================
     STREAK ACHIEVEMENTS
  ========================================================= */

  {
    id: "rising-flame",
    name: "Rising Flame",
    description: "Build a consistent 7-day streak.",
    icon: "local_fire_department",
    category: "streak",
    type: "streak",
    requirement: 7,
    points: 25,
  },

  {
    id: "week-warrior",
    name: "Week Warrior",
    description: "Stay consistent for two weeks.",
    icon: "calendar_month",
    category: "streak",
    type: "streak",
    requirement: 14,
    points: 40,
  },

  {
    id: "month-master",
    name: "Month Master",
    description: "Maintain a powerful 30-day streak.",
    icon: "workspace_premium",
    category: "streak",
    type: "streak",
    requirement: 30,
    points: 100,
  },

  {
    id: "streak-legend",
    name: "Streak Legend",
    description: "Reach a legendary 100-day streak.",
    icon: "military_tech",
    category: "streak",
    type: "streak",
    requirement: 100,
    points: 250,
  },


  /* =========================================================
     MILESTONE ACHIEVEMENTS
  ========================================================= */

  {
    id: "habit-creator",
    name: "Habit Creator",
    description: "Create your first habit.",
    icon: "add_task",
    category: "milestone",
    type: "habit-count",
    requirement: 1,
    points: 15,
  },

  {
    id: "habit-collector",
    name: "Habit Collector",
    description: "Build a collection of 5 habits.",
    icon: "library_add_check",
    category: "milestone",
    type: "habit-count",
    requirement: 5,
    points: 50,
  },

];