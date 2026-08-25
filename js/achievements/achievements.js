/* =========================================================
   HABITFLOW — ACHIEVEMENTS
   Achievement evaluation
========================================================= */

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
/**
 * =========================================================
 * ACHIEVEMENT CARD RENDERER
 * =========================================================
 *
 * Creates the HTML for a single achievement card.
 *
 * @param {Object} achievement
 * @param {Array} habits
 * @returns {string}
 */
function createAchievementCard(achievement, habits = []) {
  const unlocked = isAchievementUnlocked(achievement, habits);

  const progress = Math.min(
    getAchievementProgress(achievement, habits),
    achievement.requirement,
  );

  const progressPercentage =
    achievement.requirement > 0
      ? Math.round((progress / achievement.requirement) * 100)
      : 0;

  const cardState = unlocked ? "achievement-unlocked" : "achievement-locked";

  const statusText = unlocked ? "UNLOCKED" : "LOCKED";

  const statusClass = unlocked
    ? "achievement-status-unlocked"
    : "achievement-status-locked";

  return `
    <article
      class="achievement-card ${cardState}"
      data-category="${achievement.category}"
      data-achievement-id="${achievement.id}"
    >

      <!-- Achievement header -->

      <div class="achievement-card-top">

        <div class="achievement-badge">
          <span class="material-symbols-rounded">
            ${achievement.icon}
          </span>
        </div>

        <span class="achievement-points">
          +${achievement.points}
        </span>

      </div>


      <!-- Achievement content -->

      <div class="achievement-card-content">

        <h3>
          ${achievement.name}
        </h3>

        <p>
          ${achievement.description}
        </p>

      </div>

      <!-- Achievement progress -->

      <div class="achievement-card-progress">

        <div class="achievement-progress-label">
          <span>Progress</span>
          <span>${progress} / ${achievement.requirement}</span>
        </div>

        <div class="achievement-progress-bar">
          <div
            class="achievement-progress-fill"
            style="width: ${progressPercentage}%"
          ></div>
        </div>

      </div>


      <!-- Achievement requirement -->

      <div class="achievement-card-requirement">

        <span class="material-symbols-rounded">
          ${unlocked ? "check_circle" : "lock"}
        </span>

        <span>
          ${
            achievement.type === "streak"
              ? `Reach a ${achievement.requirement}-day streak`
              : achievement.type === "total-completions"
                ? `Complete ${achievement.requirement} habits`
                : achievement.type === "habit-count"
                  ? `Create ${achievement.requirement} habits`
                  : ""
          }
        </span>

        <span class="achievement-status ${statusClass}">
          ${statusText}
        </span>

      </div>

    </article>
  `;
}

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
 * RENDER ACHIEVEMENTS
 * =========================================================
 *
 * Generates all achievement cards from ACHIEVEMENTS.
 */
/**
 * =========================================================
 * RENDER ACHIEVEMENTS
 * =========================================================
 *
 * Generates achievement cards and places them
 * into their respective category sections.
 */
function renderAchievements() {
  const streakGrid = document.getElementById("streak-achievement-grid");

  const habitGrid = document.getElementById("habit-achievement-grid");

  const milestoneGrid = document.getElementById("milestone-achievement-grid");

  if (!streakGrid || !habitGrid || !milestoneGrid) {
    return;
  }

  /* ---------------------------------------------
       Load user's habits
    --------------------------------------------- */

  const habits = typeof loadUserHabits === "function" ? loadUserHabits() : [];

  /* ---------------------------------------------
       Clear existing cards
    --------------------------------------------- */

  streakGrid.innerHTML = "";
  habitGrid.innerHTML = "";
  milestoneGrid.innerHTML = "";

  /* ---------------------------------------------
       Render achievements by category
    --------------------------------------------- */

  ACHIEVEMENTS.forEach((achievement) => {
    const card = createAchievementCard(achievement, habits);

    switch (achievement.category) {
      case "streak":
        streakGrid.insertAdjacentHTML("beforeend", card);
        break;

      case "habit":
        habitGrid.insertAdjacentHTML("beforeend", card);
        break;

      case "milestone":
        milestoneGrid.insertAdjacentHTML("beforeend", card);
        break;
    }
  });

  /* ---------------------------------------------
       Update summary
    --------------------------------------------- */

  updateAchievementSummary(ACHIEVEMENTS, habits);
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
