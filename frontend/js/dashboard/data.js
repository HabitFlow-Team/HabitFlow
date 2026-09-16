/* =========================
   DASHBOARD STATE
========================= */

window.habits = [];

window.editingId = null;
window.currentFilter = "all";
/**
 * Temporary undo snapshots.
 * Lives only in memory and is cleared on refresh.
 */
window.habitUndoState = {};

window.globalStreak = {
  current: 0,
  best: 0,
  lastCompletedDate: null,
};

window.saveHabits = function () {
  saveUserHabits(window.habits);
};

/* =========================
   DAILY HABIT RESET
========================= */
function resetDailyHabits() {
  const today = new Date().toDateString();

  const lastActiveDate = loadLastActiveDate();
  // Same day → nothing to reset
  if (lastActiveDate === today) return;

  // Check if the user missed one or more full days
  if (lastActiveDate) {
    const lastDate = new Date(lastActiveDate);
    const currentDate = new Date(today);

    const daysPassed = Math.floor(
      (currentDate - lastDate) / (1000 * 60 * 60 * 24),
    );

    // Missed at least one entire day
    if (daysPassed > 1) {
      window.globalStreak.current = 0;

      saveUserStreak(window.globalStreak);
    }
  }

  // New day → reset completion state
  window.habits.forEach((habit) => {
    habit.completedToday = false;
  });

  // Save updated habits
  saveHabits();

  // Remember today's date
  saveLastActiveDate(today);
}

/* =========================
   LOAD HABIT 
========================= */
window.loadHabits = async function () {
  try {
    const res = await fetch(`${API_BASE}/habits`, {
      headers: authHeaders(),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Could not load habits", "error");
      window.habits = [];
      return;
    }

    

const today = new Date().toDateString();

window.habits = data.map((h) => ({
  ...h,
  id: h._id,
  completedToday: (h.completedDates || []).includes(today),
}));


  // Load the user's global streak
  window.globalStreak = loadUserStreak();

  if (storedHabits.length === 0) {
    window.habits = [];
    saveHabits();
  } else {
    window.habits = storedHabits;
  }

  // Reset completed habits if a new day has started
  resetDailyHabits();
};
