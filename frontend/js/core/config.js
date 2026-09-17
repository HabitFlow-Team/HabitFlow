// ============================================
// HabitFlow — config.js
// Backend API base URL + auth header helper

// ============================================
const API_BASE = "http://localhost:5000/api";


function authHeaders() {
  const user = Storage.get(STORAGE_KEYS.CURRENT_USER);
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.token || ""}`,
  };
} 