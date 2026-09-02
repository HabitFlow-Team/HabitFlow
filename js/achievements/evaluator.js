/**
 * =========================================================
 * ACHIEVEMENT UNLOCK CHECK
 * =========================================================
 *
 * Determines whether a single achievement has been unlocked
 * based on the user's current habit data.
 *
 * @param {Object} achievement
 * @param {Array} habits
 * @returns {boolean}
 */
function isAchievementUnlocked(achievement, habits = []) {
  if (!achievement) return false;

  switch (achievement.type) {
    /* -------------------------------------------------
           STREAK ACHIEVEMENTS
        ------------------------------------------------- */

    case "streak":
      return getBestStreak(habits) >= achievement.requirement;

    /* -------------------------------------------------
           TOTAL COMPLETION ACHIEVEMENTS
        ------------------------------------------------- */

    case "total-completions":
      return getTotalCompletions(habits) >= achievement.requirement;

    /* -------------------------------------------------
           HABIT COUNT ACHIEVEMENTS
        ------------------------------------------------- */

    case "habit-count":
      return getTotalHabits(habits) >= achievement.requirement;

    /* -------------------------------------------------
           UNKNOWN TYPE
        ------------------------------------------------- */

    default:
      return false;
  }
}
/**
 * =========================================================
 * ACHIEVEMENT PROGRESS
 * =========================================================
 *
 * Returns the user's current progress toward an achievement.
 *
 * @param {Object} achievement
 * @param {Array} habits
 * @returns {number}
 */
function getAchievementProgress(achievement, habits = []) {
  if (!achievement) return 0;

  switch (achievement.type) {
    /* -------------------------------------------------
           STREAK ACHIEVEMENTS
        ------------------------------------------------- */

    case "streak":
      return getBestStreak(habits);

    /* -------------------------------------------------
           TOTAL COMPLETION ACHIEVEMENTS
        ------------------------------------------------- */

    case "total-completions":
      return getTotalCompletions(habits);

    /* -------------------------------------------------
           HABIT COUNT ACHIEVEMENTS
        ------------------------------------------------- */

    case "habit-count":
      return getTotalHabits(habits);

    /* -------------------------------------------------
           UNKNOWN TYPE
        ------------------------------------------------- */

    default:
      return 0;
  }
}