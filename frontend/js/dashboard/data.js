/* =========================
   DASHBOARD STATE
========================= */

window.habits = [];

window.editingId = null;
window.currentFilter = "all";

/**
 * NOTE: No longer used for undo.
 * Backend persists the undo snapshot.
 * Kept temporarily so existing references don't break.
 */
window.habitUndoState = {};

/**
 * Global daily streak — still local for now.
 */
window.globalStreak = {
  current: 0,
  best: 0,
  lastCompletedDate: null,
};

/**
 * Habit persistence is now handled by backend API routes.
 * Kept as a no-op temporarily so older code doesn't break.
 */
window.saveHabits = function () {};

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


    window.globalStreak = loadUserStreak();
  } catch (err) {
    showToast("Could not reach server. Is the backend running?", "error");
    window.habits = [];
  }
};
