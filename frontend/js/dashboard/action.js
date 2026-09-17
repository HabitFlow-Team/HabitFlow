/* ============================================================
   HABIT COMPLETION
============================================================ */



/**
 * Reverts a habit completion.
 *
 * @param {Object} habit
 * @param {Object} snapshot
 */
function revertHabitCompletion(habit, snapshot) {
  if (!snapshot) return;

  habit.streak = snapshot.streak;
  habit.total = snapshot.total;
  habit.best = snapshot.best;
  habit.lastCompletedDate = snapshot.lastCompletedDate;
  habit.completedToday = snapshot.completedToday;

  habit.completedDates = snapshot.completedDates
    ? [...snapshot.completedDates]
    : habit.completedDates;
}
/* =========================
   COMPLETE HABIT
========================= */
window.completeHabit = async function (card, habit) {
  try {
    const res = await fetch(`${API_BASE}/habits/${habit.id}/complete`, {
      method: "PATCH",
      headers: authHeaders(),
    });

    const updated = await res.json();

    if (!res.ok) {
      showToast(updated.message || "Could not complete habit", "error");
      return;
    }

    Object.assign(habit, updated, { id: updated._id, completedToday: true });

    // Update overall daily streak
    updateGlobalStreak();

    setHabitCompletedUI(card);
    refreshChips(card, habit);

    const pct = updateProgress();
    applyFilter();
    updateFilterCounts();

    if (pct === 100) {
      fireConfetti();
      showCompletionPopup();
    } else {
      showToast("Nice! Habit completed ✅");
    }
  } catch (err) {
    showToast("Could not reach server. Is the backend running?", "error");
  }
};

/* =========================
   UNDO HABIT
========================= */
window.undoHabit = async function (card, habit) {
  try {
    const res = await fetch(`${API_BASE}/habits/${habit.id}/undo`, {
      method: "PATCH",
      headers: authHeaders(),
    });

    const updated = await res.json();

    if (!res.ok) {
      showToast(updated.message || "Undo not available", "error");
      return;
    }

    Object.assign(habit, updated, {
      id: updated._id,
    });

    setHabitUndoUI(card);
    refreshChips(card, habit);

    updateProgress();
    applyFilter();
    updateFilterCounts();

    showToast("Marked as not done ❌");
  } catch (err) {
    showToast("Could not reach server. Is the backend running?", "error");
  }
};