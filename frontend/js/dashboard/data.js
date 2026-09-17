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




/* =========================
   LOAD HABITS — from backend now 
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


    // Normalize: Mongo's _id → .id (rest of the app already expects .id)
    // completedToday is derived fresh from completedDates —
    // no separate "daily reset" step needed anymore.
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
/**
 * No-op now — every backend route already returns the updated habit,
 * so each caller updates window.habits directly from that response.
 * Kept so any leftover saveHabits() calls elsewhere don't crash.
 */
window.saveHabits = function () {};