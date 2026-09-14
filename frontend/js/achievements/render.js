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