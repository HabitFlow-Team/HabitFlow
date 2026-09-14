// ============================================
// HabitFlow — auth.js
// Real Backend Authentication (Express + MongoDB)
// ============================================

// ============================================
// TOAST
// ============================================
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");

  let icon = "info";
  if (type === "success") icon = "check_circle";
  if (type === "error") icon = "error";
  if (type === "warning") icon = "lock";

  toast.innerHTML = `
  <span class="material-symbols-rounded toast-icon toast-icon-${type}">
    ${icon}
  </span>
  <span class="toast-message">${message}</span>
`;

  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// Get current logged in user
function getCurrentUser() {
  return Storage.get(STORAGE_KEYS.CURRENT_USER);
}

// Check auth state
function isAuthenticated() {
  return !!getCurrentUser();
}

// ============================================
// AUTHORIZATION
// ============================================

/**
 * Check whether the current user has admin privileges.
 * Frontend check is for UI convenience only (show/hide admin menu) —
 * the backend independently verifies isAdmin from the database on
 * every admin request, so this can never be spoofed for real access.
 */
function hasAdminPrivileges() {
  const user = getCurrentUser();
  return user?.isAdmin === true;
}

// Save current session
function saveSession(user) {
  Storage.set(STORAGE_KEYS.CURRENT_USER, user);
}

// Logout user
function logoutUser() {
  Storage.remove(STORAGE_KEYS.CURRENT_USER);
  window.location.href = "index.html";
}

// ============================================
// REGISTER — real backend call
// ============================================
async function registerUser(firstName, lastName, email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Registration failed" };
    }

    const [fName, ...rest] = data.user.name.split(" ");
    const lName = rest.join(" ");

    const sessionUser = {
      id: data.user.id,
      username: data.user.name,
      firstName: fName,
      lastName: lName,
      email: data.user.email,
      isAdmin: data.user.isAdmin,
      token: data.token,
    };

    saveSession(sessionUser);
    return { success: true, user: sessionUser };
  } catch (err) {
    return { success: false, message: "Could not reach server. Is the backend running?" };
  }
}

// ============================================
// LOGIN — real backend call
// ============================================
async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Login failed" };
    }

    const [fName, ...rest] = data.user.name.split(" ");
    const lName = rest.join(" ");

    const sessionUser = {
      id: data.user.id,
      username: data.user.name,
      firstName: fName,
      lastName: lName,
      email: data.user.email,
      isAdmin: data.user.isAdmin,
      token: data.token,
    };

    saveSession(sessionUser);
    return { success: true, user: sessionUser };
  } catch (err) {
    return { success: false, message: "Could not reach server. Is the backend running?" };
  }
}

// ============================================
// GUEST LOGIN (still local-only, no backend)
// ============================================
function loginAsGuest() {
  const guestUser = {
    id: "guest",
    username: "Guest",
    email: null,
    isGuest: true,
  };
  saveSession(guestUser);
  return guestUser;
}

const guestBtn = document.getElementById("guestBtn");
guestBtn?.addEventListener("click", () => {
  loginAsGuest();
  window.location.href = "dashboard.html";
});

// ============================================
// REGISTER FORM
// ============================================
const registerForm = document.getElementById("register-form");

registerForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName")?.value.trim();
  const lastName = document.getElementById("lastName")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;
  const confirmPassword = document.getElementById("confirmPassword")?.value;

  if (!firstName || !lastName || !email || !password) {
    showToast("Please fill all fields", "error");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Passwords do not match", "error");
    return;
  }

  const submitBtn = registerForm.querySelector(".btn-auth");
  if (submitBtn) submitBtn.disabled = true;

  const result = await registerUser(firstName, lastName, email, password);

  if (submitBtn) submitBtn.disabled = false;

  if (!result.success) {
    showToast(result.message, "error");
    return;
  }

  showToast("Account created successfully ✨", "success");
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1200);
});

// ============================================
// LOGIN FORM
// ============================================
const loginForm = document.getElementById("login-form");

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    showToast("Please enter email and password", "error");
    return;
  }

  const submitBtn = loginForm.querySelector(".btn-auth");
  if (submitBtn) submitBtn.disabled = true;

  const result = await loginUser(email, password);

  if (submitBtn) submitBtn.disabled = false;

  if (!result.success) {
    showToast(result.message, "error");
    return;
  }

  showToast("Welcome back ✨", "success");
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1200);
});