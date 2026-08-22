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
            return (
                getBestStreak(habits) >=
                achievement.requirement
            );


        /* -------------------------------------------------
           TOTAL COMPLETION ACHIEVEMENTS
        ------------------------------------------------- */

        case "total-completions":
            return (
                getTotalCompletions(habits) >=
                achievement.requirement
            );


        /* -------------------------------------------------
           HABIT COUNT ACHIEVEMENTS
        ------------------------------------------------- */

        case "habit-count":
            return (
                getTotalHabits(habits) >=
                achievement.requirement
            );


        /* -------------------------------------------------
           UNKNOWN TYPE
        ------------------------------------------------- */

        default:
            return false;
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

    const unlocked =
        isAchievementUnlocked(achievement, habits);

    const cardState = unlocked
        ? "achievement-unlocked"
        : "achievement-locked";

    const statusText = unlocked
        ? "UNLOCKED"
        : "LOCKED";

    const statusClass = unlocked
        ? "achievement-status-unlocked"
        : "achievement-status-locked";


    return `
        <article
            class="achievement-card ${cardState}"
            data-category="${achievement.category}"
            data-achievement-id="${achievement.id}"
        >

            <!-- Achievement icon -->

            <div class="achievement-badge">

                <span class="material-symbols-rounded">
                    ${achievement.icon}
                </span>

            </div>


            <!-- Achievement content -->

            <div class="achievement-card-content">

                <div class="achievement-card-top">

                    <h3>
                        ${achievement.name}
                    </h3>

                    <span class="achievement-points">
                        +${achievement.points}
                    </span>

                </div>


                <p class="achievement-description">
                    ${achievement.description}
                </p>


                <!-- Requirement -->

                <div class="achievement-card-requirement">

                    <span class="material-symbols-rounded">
                        ${unlocked ? "check_circle" : "lock"}
                    </span>

                    <span>
                        ${achievement.requirement}
                        ${achievement.type === "streak"
                            ? " day streak"
                            : achievement.type === "total-completions"
                                ? " completions"
                                : achievement.type === "habit-count"
                                    ? " habits"
                                    : ""}
                    </span>


                    <!-- Status -->

                    <span class="achievement-status ${statusClass}">
                        ${statusText}
                    </span>

                </div>

            </div>

        </article>
    `;
}