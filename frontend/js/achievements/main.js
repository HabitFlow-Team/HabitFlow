/* =========================================================
   HABITFLOW — ACHIEVEMENTS
   Achievement evaluation
========================================================= */




/**
 * =========================================================
 * UPDATE ACHIEVEMENT SUMMARY
 * =========================================================
 *
 * Calculates and displays the user's achievement statistics.
 *
 * @param {Array} achievements
 * @param {Array} habits
 */
function updateAchievementSummary(achievements, habits = []) {
  const unlockedCount = achievements.filter((achievement) =>
    isAchievementUnlocked(achievement, habits),
  ).length;

  const lockedCount = achievements.length - unlockedCount;

  const totalPoints = achievements
    .filter((achievement) => isAchievementUnlocked(achievement, habits))
    .reduce((total, achievement) => total + achievement.points, 0);

  const bestStreak = getBestStreak(habits);

  /* ---------------------------------------------
       Update summary UI
    --------------------------------------------- */

  const unlockedElement = document.getElementById("summary-unlocked");

  const lockedElement = document.getElementById("summary-locked");

  const pointsElement = document.getElementById("summary-points");

  const bestStreakElement = document.getElementById("summary-best-streak");

  const achievementProgressElement = document.getElementById(
    "achievement-progress-count",
  );

  if (unlockedElement) {
    unlockedElement.textContent = unlockedCount;
  }

  if (lockedElement) {
    lockedElement.textContent = lockedCount;
  }

  if (pointsElement) {
    pointsElement.textContent = totalPoints;
  }

  if (bestStreakElement) {
    bestStreakElement.textContent = bestStreak;
  }

  if (achievementProgressElement) {
    achievementProgressElement.textContent = `${unlockedCount} / ${achievements.length}`;
  }
}



/**
 * =========================================================
 * ACHIEVEMENT FILTERS
 * =========================================================
 *
 * Filters dynamically generated achievement cards
 * based on their category.
 */
function setupAchievementFilters() {
  const filterButtons = document.querySelectorAll(".achievement-filter");

  const cards = document.querySelectorAll(".achievement-card");

  const categorySections = document.querySelectorAll(
    ".achievement-category-section",
  );

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.category;

      /* ---------------------------------------------
               Update active filter
            --------------------------------------------- */

      filterButtons.forEach((filterButton) => {
        filterButton.classList.remove("active");
      });

      button.classList.add("active");

      /* ---------------------------------------------
               Filter achievement cards
            --------------------------------------------- */

      categorySections.forEach((section) => {
        const categoryGrid = section.querySelector(".achievement-grid");

        if (!categoryGrid) return;

        const sectionCategory = categoryGrid.id.replace(
          "-achievement-grid",
          "",
        );

        const shouldShow =
          selectedCategory === "all" || sectionCategory === selectedCategory;

        section.style.display = shouldShow ? "" : "none";
      });
    });
  });
}

/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  renderAchievements();
  setupAchievementFilters();
});
