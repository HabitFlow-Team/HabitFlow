/* =========================
   HABIT MODAL SELECTORS
========================= */

const habitModal = document.getElementById("habit-modal");

const habitModalHeading = document.getElementById("habit-modal-heading");
const habitModalIcon = document.getElementById("habit-modal-icon");

const habitName = document.getElementById("habit-name");
const habitCategory = document.getElementById("habit-category-modal");
const habitTime = document.getElementById("habit-time-modal");

const habitCancel = document.getElementById("habit-cancel");
const habitSave = document.getElementById("habit-save");

const fabAddHabit = document.getElementById("fab-add-habit");

/* =========================
   MODAL STATE
========================= */

window.habitModalMode = "create";
window.editingId = null;

/* =========================
   SAVE BUTTON LOADING
========================= */

window.setSaveLoading = function (isLoading) {
  habitSave.disabled = isLoading;

  if (isLoading) {
    habitSave.textContent = "Saving...";
    return;
  }

  habitSave.textContent =
    window.habitModalMode === "create" ? "Add Habit" : "Save Changes";
};

/* =========================
   CLOSE MODAL
========================= */

function closeHabitModal() {
  habitModal.hidden = true;

  window.editingId = null;

  habitName.value = "";
  habitCategory.value = "other";
  habitTime.value = "";

  setSaveLoading(false);
}

/* =========================
   OPEN CREATE MODAL
========================= */

window.openCreateHabitModal = function () {
  window.habitModalMode = "create";

  habitModalHeading.textContent = "New Habit";
  habitModalIcon.textContent = "add_task";

  habitName.value = "";
  habitCategory.value = "other";
  habitTime.value = "";

  setSaveLoading(false);

  habitModal.hidden = false;

  habitName.focus();
};

/* =========================
   OPEN EDIT MODAL
========================= */

window.openEditModal = function (habit, id) {
  window.habitModalMode = "edit";

  window.editingId = id;

  habitModalHeading.textContent = "Edit Habit";
  habitModalIcon.textContent = "edit";

  habitName.value = habit.name;
  habitCategory.value = habit.category;
  habitTime.value = habit.time || "";

  setSaveLoading(false);

  habitModal.hidden = false;

  habitName.focus();
};

/* =========================
   FAB
========================= */

if (fabAddHabit) {
  fabAddHabit.addEventListener("click", () => {
    openCreateHabitModal();
  });
}

/* =========================
   CLOSE EVENTS
========================= */

habitCancel.addEventListener("click", closeHabitModal);

habitModal.addEventListener("click", (e) => {
  if (e.target === habitModal) {
    closeHabitModal();
  }
});

/* =========================
   SAVE HABIT
========================= */

habitSave.addEventListener("click", async () => {
  /* =========================
     CREATE MODE
  ========================= */

  if (window.habitModalMode === "create") {
     setSaveLoading(true);
    const created = window.createHabit(
      habitName.value,
      habitCategory.value,
      habitTime.value,
    );
     setSaveLoading(false);

    if (!created) {
      return;
    }

    closeHabitModal();

    return;
  }

  /* =========================
     EDIT MODE
  ========================= */

  const habit = window.habits.find((h) => h.id == window.editingId);

  if (!habit) return;

  const updatedName = habitName.value.trim();

  if (!updatedName) {
    showToast("Habit name cannot be empty");
    return;
  }
   setSaveLoading(true);
  try{
    const res = await fetch(`${API_BASE}/habits/${habit.id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({
        name: updatedName,
        category: habitCategory.value,
        time: habitTime.value,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Could not update habit", "error");
      return;
    }

    Object.assign(habit, data, { id: data._id });

    const card = document.querySelector(`[data-id="${window.editingId}"]`);

    if (card) {
      const cat = window.CATEGORIES[habit.category];
      card.querySelector(".habit-name").textContent = habit.name;
      card.querySelector(".habit-dot").textContent = cat.icon;
      card.style.setProperty("--cat-color", cat.color);

      let chips = card.querySelector(".habit-chips");
      let timeChip = card.querySelector(".chip-time");
  }
  

  if (habit.time) {
    if (!timeChip) {
      timeChip = document.createElement("span");
      timeChip.className = "chip chip-time";
      chips.appendChild(timeChip);
    }

    timeChip.textContent = `⏰ ${habit.time}`;
  } else {
    timeChip?.remove();
  }

  showToast("Habit updated ✨");
  closeHabitModal();
   } catch (err) {
    showToast("Could not reach server. Is the backend running?", "error");
  } finally {
    setSaveLoading(false);
  }
});

/* =========================
   KEYBOARD SHORTCUTS
========================= */

document.addEventListener("keydown", (e) => {
  if (habitModal.hidden) return;

  if (e.key === "Escape") {
    closeHabitModal();
    return;
  }

  if (e.key === "Enter") {
    e.preventDefault();

    if (!habitSave.disabled) {
      habitSave.click();
    }
  }
});
