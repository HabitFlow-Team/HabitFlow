// ============================================================
//  HabitFlow — dashboard.js (FINAL STABLE VERSION)
//  ✅ Fixes:
//     - Edit modal save (robust UI update)
//     - Confetti only at 100% completion
//     - Undo hover text
//     - Toast popup
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {
  /* =========================
      SELECTORS
  ========================= */
  const todayDate = document.getElementById("today-date");
  const habitContainer = document.querySelector(".habit-list-container");
  /* =========================
    CONSTANTS
========================= */
  window.CATEGORIES = {
    health: { icon: "🌿", color: "var(--cat-health)" },
    learning: { icon: "📚", color: "var(--cat-learning)" },
    fitness: { icon: "💪", color: "var(--cat-fitness)" },
    mindfulness: { icon: "🧠", color: "var(--cat-mindfulness)" },
    creativity: { icon: "🎨", color: "var(--cat-creativity)" },
    work: { icon: "💻", color: "var(--cat-work)" },
    other: { icon: "✨", color: "var(--cat-other)" },
  };

  /* =========================
   INITIAL APP LOAD
========================= */

  await loadHabits();

  initFilters();
  renderDashboardProfile();

  window.habits.forEach(renderHabitCard);

  updateProgress();
  updateFilterCounts();
  applyFilter();

  /* =========================
      DATE
  ========================= */

  function renderTodayDate() {
    const today = new Date();

    const formatted = today.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    todayDate.textContent = formatted;
  }

  renderTodayDate();

  /* =========================
     ADD HABIT
  ========================= */
  window.createHabit = async function (name, category, time) {
    name = name.trim();
    name = name.charAt(0).toUpperCase() + name.slice(1);

    if (!name) {
      showToast("Enter a habit name");
      return false;
    }

    // Prevent duplicate habits
    if (
      window.habits.some((h) => h.name.toLowerCase() === name.toLowerCase())
    ) {
      showToast("Habit already exists ⚠️");
      return false;
    }
    try {
      const res = await fetch(`${API_BASE}/habits`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ name, category, time }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Could not add habit", "error");
        return false;
      }

      const habit = { ...data, id: data._id, completedToday: false };
      window.habits.push(habit);
      renderHabitCard(habit);

      updateProgress();
      applyFilter();
      updateFilterCounts();

      showToast("Habit added ✨");

      return true;
    }   catch (err) {
      showToast("Could not reach server. Is the backend running?", "error");
      return false;
    }
  };

    /* =========================
      DELETE HABIT
    ========================= */
    async function deleteHabit(card, id) {
       try {
    const res = await fetch(`${API_BASE}/habits/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (!res.ok) {
      const data = await res.json();

      showToast(
        data.message || "Could not delete habit",
        "error"
      );

      return;
    }
      window.habits = window.habits.filter((h) => h.id != id);

      card.classList.add("deleting");

      setTimeout(() => {
        card.remove();
        updateProgress();
        applyFilter();
        updateFilterCounts();
      }, 250);

      showToast(`
    <span class="material-symbols-rounded toast-icon">
      delete_sweep
    </span>
    Habit deleted
  `);
  }  catch (err) {
    showToast(
      "Could not reach server. Is the backend running?",
      "error"
    );
  }
}

    habitContainer.addEventListener("click", (e) => {
      const card = e.target.closest(".habit-card");
      if (!card) return;

      const id = card.getAttribute("data-id");
      const habit = window.habits.find((h) => h.id == id);
      if (!habit) return;

      // ===== MOBILE EDIT =====
      if (e.target.closest(".btn-edit-trigger")) {
        openEditModal(habit, id);

        card.querySelector(".habit-dropdown")?.classList.remove("open");

        return;
      }

      // ===== MOBILE DELETE =====
      if (e.target.closest(".btn-delete-trigger")) {
        deleteHabit(card, id);

        card.querySelector(".habit-dropdown")?.classList.remove("open");

        return;
      }

      // ===== MOBILE MORE MENU =====
      if (e.target.closest(".btn-more")) {
        e.stopPropagation();

        const dropdown = card.querySelector(".habit-dropdown");

        document.querySelectorAll(".habit-dropdown.open").forEach((d) => {
          if (d !== dropdown) {
            d.classList.remove("open");
          }
        });

        dropdown.classList.toggle("open");
        return;
      }

      // ===== EDIT =====
      if (e.target.closest(".btn-edit")) {
        openEditModal(habit, id);
        return;
      }

      // ===== COMPLETE =====
      if (e.target.closest(".btn-complete")) {
        if (!habit.completedToday) {
          completeHabit(card, habit);
        } else {
          undoHabit(card, habit);
        }

        return;
      }

      if (e.target.closest(".btn-delete")) {
        deleteHabit(card, id);
        return;
      }
    });

    /* =========================
       HOVER → UNDO TEXT
    ========================= */
    habitContainer.addEventListener("mouseover", (e) => {
      const btn = e.target.closest(".btn-complete");
      if (!btn) return;

      const card = btn.closest(".habit-card");
      if (card.classList.contains("is-completed")) {
        btn.innerText = "Undo ? ↩️";
      }
    });

    habitContainer.addEventListener("mouseout", (e) => {
      const btn = e.target.closest(".btn-complete");
      if (!btn) return;

      const card = btn.closest(".habit-card");
      if (card.classList.contains("is-completed")) {
        btn.innerText = "Completed! 🔥";
      }
    });
  });
