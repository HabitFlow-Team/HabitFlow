/* ============================================================
   HABIT COMPLETION
============================================================ */

/**
 * Applies a habit completion.
 *
 * Handles all habit-related state updates while storing
 * a temporary undo snapshot in memory.
 *
 * @param {Object} habit
 */
function applyHabitCompletion(habit) {
  const today = new Date().toDateString();

  if (!habit.lastCompletedDate) {
    habit.streak = 1;
  } else {
    const previous = new Date(habit.lastCompletedDate);
    const current = new Date(today);
    const diffDays = Math.floor(
      (current - previous) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 1) {
      habit.streak++;
    } else if (diffDays > 1) {
      habit.streak = 1;
    }
  }

  habit.completedToday = true;
  habit.total++;
  habit.lastCompletedDate = today;
  habit.best = Math.max(habit.best, habit.streak);

  // completedDates history — needed for stats page charts/calendar
  if (!habit.completedDates) habit.completedDates = [];

  if (!habit.completedDates.includes(today)) {
    habit.completedDates.push(today);
  }
}

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
window.completeHabit = function (card, habit) {
  const snapshot = {
    streak: habit.streak,
    total: habit.total,
    best: habit.best,
    lastCompletedDate: habit.lastCompletedDate,
    completedToday: habit.completedToday,
    completedDates: [...(habit.completedDates || [])],
  };

  window.habitUndoState[habit.id] = snapshot;

  // Centralized habit completion logic
  applyHabitCompletion(habit);

  // Update overall daily streak
  updateGlobalStreak();

  saveHabits();

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
};

/* =========================
   UNDO HABIT
========================= */
window.undoHabit = function (card, habit) {
  /* ----------------------------------------------------------
     Undo is only available while the temporary snapshot exists.
     Since the snapshot is stored only in memory, refreshing the
     app permanently removes the ability to undo.

     (ARYAAN)
     ---------------------------------------------------------- */
  const snapshot = window.habitUndoState[habit.id];

  if (!snapshot) {
    showToast("Undo is only available until you refresh the app.");
    return;
  }

  /* ----------------------------------------------------------
     Restore the habit exactly as it was before completion.
     Using a snapshot is safer than manually decrementing values,
     especially as more habit properties are added in the future.
     ---------------------------------------------------------- */
  habit.streak = snapshot.streak;
  habit.total = snapshot.total;
  habit.best = snapshot.best;
  habit.lastCompletedDate = snapshot.lastCompletedDate;
  habit.completedToday = snapshot.completedToday;
  habit.completedDates = [...snapshot.completedDates];

  // Consume the snapshot so only one undo is possible.
  delete window.habitUndoState[habit.id];
  /* ---------------------------------------------------------- */

  saveHabits();

  setHabitUndoUI(card);

  refreshChips(card, habit);

  updateProgress();
  applyFilter();
  updateFilterCounts();

  showToast("Marked as not done ❌");
};
