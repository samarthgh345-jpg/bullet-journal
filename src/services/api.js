const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:5000/api";

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("bulletJournalToken");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

/* =========================
   AUTH
========================= */

export const registerUser = (userData) => {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const loginUser = (userData) => {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

/* =========================
   TASKS
========================= */

export const getTasks = () => {
  return request("/tasks");
};

export const createTask = (taskData) => {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify(taskData),
  });
};

export const updateTask = (id, taskData) => {
  return request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(taskData),
  });
};

export const deleteTask = (id) => {
  return request(`/tasks/${id}`, {
    method: "DELETE",
  });
};

/* =========================
   HABITS
========================= */

export const getHabits = () => {
  return request("/habits");
};

export const createHabit = (habitData) => {
  return request("/habits", {
    method: "POST",
    body: JSON.stringify(habitData),
  });
};

export const updateHabit = (id, habitData) => {
  return request(`/habits/${id}`, {
    method: "PUT",
    body: JSON.stringify(habitData),
  });
};

export const toggleHabit = (id, date) => {
  return request(`/habits/${id}/toggle`, {
    method: "POST",
    body: JSON.stringify({ date }),
  });
};

export const deleteHabit = (id) => {
  return request(`/habits/${id}`, {
    method: "DELETE",
  });
};

/* =========================
   EVENTS
========================= */

export const getEvents = () => {
  return request("/events");
};

export const createEvent = (eventData) => {
  return request("/events", {
    method: "POST",
    body: JSON.stringify(eventData),
  });
};

export const updateEvent = (id, eventData) => {
  return request(`/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(eventData),
  });
};

export const deleteEvent = (id) => {
  return request(`/events/${id}`, {
    method: "DELETE",
  });
};

// ========================
// FINANCE
// ========================

export const getFinance = () => {
  return request("/finance");
};

export const addFinance = (data) => {
  return request("/finance", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const deleteFinance = (id) => {
  return request(`/finance/${id}`, {
    method: "DELETE",
  });
};

// ========================
// NOTES
// ========================

export const getNotes = () => {
  return request("/notes");
};

export const createNote = () => {
  return request("/notes", {
    method: "POST",
  });
};

export const updateNote = (id, data) => {
  return request(`/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteNote = (id) => {
  return request(`/notes/${id}`, {
    method: "DELETE",
  });
};

// ========================
// WISHLIST
// ========================

export const getWishlist = () => {
  return request("/wishlist");
};

export const createWishlistItem = (data) => {
  return request("/wishlist", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateWishlistItem = (id, data) => {
  return request(`/wishlist/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteWishlistItem = (id) => {
  return request(`/wishlist/${id}`, {
    method: "DELETE",
  });
};

// ========================
// GOALS
// ========================

export const getGoals = (scope) => {
  const query = scope ? `?scope=${scope}` : "";
  return request(`/goals${query}`);
};

export const createGoal = (data) => {
  return request("/goals", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateGoal = (id, data) => {
  return request(`/goals/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteGoal = (id) => {
  return request(`/goals/${id}`, {
    method: "DELETE",
  });
};

// ========================
// WEEKLY TASKS
// ========================

export const getWeeklyTasks = () => {
  return request("/weekly-tasks");
};

export const createWeeklyTask = (data) => {
  return request("/weekly-tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateWeeklyTask = (id, data) => {
  return request(`/weekly-tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteWeeklyTask = (id) => {
  return request(`/weekly-tasks/${id}`, {
    method: "DELETE",
  });
};

// ========================
// SYSTEM
// ========================

export const clearJournalData = () => {
  return request("/journal/clear", {
    method: "DELETE",
  });
};
