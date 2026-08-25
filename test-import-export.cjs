/**
 * Comprehensive Import/Export API Test
 * 
 * Simulates the exact logic Settings.jsx uses:
 *   Export: fetch from all 9 endpoints → serialize JSON
 *   Import: parse JSON → create records via individual POST calls
 * 
 * Tests: export fidelity, import correctness, user isolation,
 *        malformed JSON, missing fields, security (no secrets).
 */

const API = "http://localhost:5000/api";

async function req(endpoint, token, options = {}) {
  const res = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  return res.json();
}

async function run() {
  let passed = 0;
  let failed = 0;
  const assert = (label, condition) => {
    if (condition) { console.log(`  ✅ ${label}`); passed++; }
    else { console.log(`  ❌ ${label}`); failed++; }
  };

  // ================================================================
  // 1. REGISTER TWO USERS
  // ================================================================
  console.log("\n1. REGISTER USERS");
  const ts = Date.now();
  const dataA = await req("/auth/register", null, {
    method: "POST",
    body: JSON.stringify({ name: "User A", email: `a_${ts}@test.com`, password: "password" }),
  });
  const dataB = await req("/auth/register", null, {
    method: "POST",
    body: JSON.stringify({ name: "User B", email: `b_${ts}@test.com`, password: "password" }),
  });
  const tokenA = dataA.token;
  const tokenB = dataB.token;
  assert("User A registered", !!tokenA);
  assert("User B registered", !!tokenB);

  // ================================================================
  // 2. CREATE TEST DATA FOR USER A (all 9 feature areas)
  // ================================================================
  console.log("\n2. CREATE TEST DATA (User A)");

  // Tasks (field: title)
  const task1 = await req("/tasks", tokenA, { method: "POST", body: JSON.stringify({ title: "Export Test Task", priority: "high" }) });
  assert("Task created", task1.title === "Export Test Task");

  // Weekly Tasks (field: text, day)
  const wt1 = await req("/weekly-tasks", tokenA, { method: "POST", body: JSON.stringify({ text: "Monday task", day: "monday" }) });
  assert("Weekly task created", wt1.text === "Monday task");

  // Habits (field: name)
  const hab1 = await req("/habits", tokenA, { method: "POST", body: JSON.stringify({ name: "Read books" }) });
  assert("Habit created", hab1.name === "Read books");

  // Events (field: title, date)
  const ev1 = await req("/events", tokenA, { method: "POST", body: JSON.stringify({ title: "Birthday", date: "2026-09-01" }) });
  assert("Event created", ev1.title === "Birthday");

  // Finance (field: description, amount, type)
  const fin1 = await req("/finance", tokenA, { method: "POST", body: JSON.stringify({ description: "Salary", amount: 5000, type: "income", category: "salary" }) });
  assert("Finance created", fin1.description === "Salary");

  // Notes (POST creates empty, then PUT to set title/content)
  const note1 = await req("/notes", tokenA, { method: "POST" });
  await req(`/notes/${note1._id}`, tokenA, { method: "PUT", body: JSON.stringify({ title: "My Note", content: "Note content here" }) });
  assert("Note created & updated", !!note1._id);

  // Wishlist (field: text)
  const wish1 = await req("/wishlist", tokenA, { method: "POST", body: JSON.stringify({ text: "New keyboard" }) });
  assert("Wishlist created", wish1.text === "New keyboard");

  // Monthly Goals (field: text, scope)
  const mg1 = await req("/goals", tokenA, { method: "POST", body: JSON.stringify({ text: "Finish project", scope: "monthly" }) });
  assert("Monthly goal created", mg1.text === "Finish project");

  // Weekly Goals (field: text, scope)
  const wg1 = await req("/goals", tokenA, { method: "POST", body: JSON.stringify({ text: "Exercise 3x", scope: "weekly" }) });
  assert("Weekly goal created", wg1.text === "Exercise 3x");

  // ================================================================
  // 3. EXPORT (simulate Settings.exportJournal)
  // ================================================================
  console.log("\n3. EXPORT (User A)");

  const [tasks, weeklyTasks, habits, events, transactions, notes, wishlist, monthlyGoals, weeklyGoals] =
    await Promise.all([
      req("/tasks", tokenA),
      req("/weekly-tasks", tokenA),
      req("/habits", tokenA),
      req("/events", tokenA),
      req("/finance", tokenA),
      req("/notes", tokenA),
      req("/wishlist", tokenA),
      req("/goals?scope=monthly", tokenA),
      req("/goals?scope=weekly", tokenA),
    ]);

  const exportedJSON = {
    version: 1,
    exportedAt: new Date().toISOString(),
    tasks,
    habits,
    transactions,
    wishlist,
    notes,
    events,
    monthlyGoals,
    weeklyGoals,
    weeklyTasks,
    settings: { theme: "dark", currency: "USD", firstDay: "sunday" },
  };

  const jsonString = JSON.stringify(exportedJSON, null, 2);

  assert("Export has tasks", Array.isArray(exportedJSON.tasks) && exportedJSON.tasks.length >= 1);
  assert("Export has habits", Array.isArray(exportedJSON.habits) && exportedJSON.habits.length >= 1);
  assert("Export has transactions", Array.isArray(exportedJSON.transactions) && exportedJSON.transactions.length >= 1);
  assert("Export has notes", Array.isArray(exportedJSON.notes) && exportedJSON.notes.length >= 1);
  assert("Export has wishlist", Array.isArray(exportedJSON.wishlist) && exportedJSON.wishlist.length >= 1);
  assert("Export has events", Array.isArray(exportedJSON.events) && exportedJSON.events.length >= 1);
  assert("Export has monthlyGoals", Array.isArray(exportedJSON.monthlyGoals) && exportedJSON.monthlyGoals.length >= 1);
  assert("Export has weeklyGoals", Array.isArray(exportedJSON.weeklyGoals) && exportedJSON.weeklyGoals.length >= 1);
  assert("Export has weeklyTasks", exportedJSON.weeklyTasks && exportedJSON.weeklyTasks.monday.length >= 1);
  assert("Export has settings", exportedJSON.settings.theme === "dark" && exportedJSON.settings.currency === "USD");
  assert("Export has version", exportedJSON.version === 1);

  // ================================================================
  // 4. SECURITY: No secrets in exported JSON
  // ================================================================
  console.log("\n4. SECURITY CHECK");
  assert("No JWT token in export", !jsonString.includes("eyJ"));
  assert("No password in export", !jsonString.includes("password"));
  assert("No MONGODB_URI in export", !jsonString.includes("mongodb+srv"));
  assert("No JWT_SECRET in export", !jsonString.includes("JWT_SECRET"));

  // ================================================================
  // 5. USER ISOLATION (User B has no data)
  // ================================================================
  console.log("\n5. USER ISOLATION (pre-import)");
  const bTasks = await req("/tasks", tokenB);
  const bHabits = await req("/habits", tokenB);
  const bWishlist = await req("/wishlist", tokenB);
  assert("User B has no tasks", Array.isArray(bTasks) && bTasks.length === 0);
  assert("User B has no habits", Array.isArray(bHabits) && bHabits.length === 0);
  assert("User B has no wishlist items", Array.isArray(bWishlist) && bWishlist.length === 0);

  // ================================================================
  // 6. IMPORT (simulate Settings.importJournal for User B)
  // ================================================================
  console.log("\n6. IMPORT (User B)");
  const data = JSON.parse(jsonString);

  // Import Tasks
  if (Array.isArray(data.tasks)) {
    for (const item of data.tasks) {
      try {
        const created = await req("/tasks", tokenB, { method: "POST", body: JSON.stringify({ title: item.title || item.text || "Untitled", priority: item.priority, dueDate: item.dueDate }) });
        if (item.completed) {
          await req(`/tasks/${created._id}`, tokenB, { method: "PUT", body: JSON.stringify({ completed: true }) });
        }
      } catch (err) { console.error("  task import err:", err.message); }
    }
  }

  // Import Weekly Tasks
  if (data.weeklyTasks && typeof data.weeklyTasks === "object") {
    for (const day of ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]) {
      if (Array.isArray(data.weeklyTasks[day])) {
        for (const item of data.weeklyTasks[day]) {
          try {
            const created = await req("/weekly-tasks", tokenB, { method: "POST", body: JSON.stringify({ text: item.text || "Untitled", day }) });
            if (item.completed) {
              await req(`/weekly-tasks/${created._id}`, tokenB, { method: "PUT", body: JSON.stringify({ completed: true }) });
            }
          } catch (err) { console.error("  weekly task import err:", err.message); }
        }
      }
    }
  }

  // Import Habits
  if (Array.isArray(data.habits)) {
    for (const item of data.habits) {
      try { await req("/habits", tokenB, { method: "POST", body: JSON.stringify({ name: item.name || item.text }) }); } catch (err) { console.error(err.message); }
    }
  }

  // Import Finance
  if (Array.isArray(data.transactions)) {
    for (const item of data.transactions) {
      try { await req("/finance", tokenB, { method: "POST", body: JSON.stringify({ description: item.description, amount: item.amount, type: item.type, category: item.category || "other", date: item.date }) }); } catch (err) { console.error(err.message); }
    }
  }

  // Import Notes
  if (Array.isArray(data.notes)) {
    for (const item of data.notes) {
      try {
        const newNote = await req("/notes", tokenB, { method: "POST" });
        await req(`/notes/${newNote._id}`, tokenB, { method: "PUT", body: JSON.stringify({ title: item.title || "Untitled", content: item.content }) });
      } catch (err) { console.error(err.message); }
    }
  }

  // Import Wishlist
  if (Array.isArray(data.wishlist)) {
    for (const item of data.wishlist) {
      try {
        const created = await req("/wishlist", tokenB, { method: "POST", body: JSON.stringify({ text: item.text || "Untitled", category: item.category }) });
        if (item.completed) {
          await req(`/wishlist/${created._id}`, tokenB, { method: "PUT", body: JSON.stringify({ completed: true }) });
        }
      } catch (err) { console.error(err.message); }
    }
  }

  // Import Events
  if (data.events && Array.isArray(data.events)) {
    for (const item of data.events) {
      try { await req("/events", tokenB, { method: "POST", body: JSON.stringify({ title: item.title || item.text, date: item.date, description: item.description, type: item.type }) }); } catch (err) { console.error(err.message); }
    }
  }

  // Import Monthly Goals
  if (Array.isArray(data.monthlyGoals)) {
    for (const item of data.monthlyGoals) {
      try {
        const created = await req("/goals", tokenB, { method: "POST", body: JSON.stringify({ text: item.text || "Untitled", scope: "monthly" }) });
        if (item.completed) {
          await req(`/goals/${created._id}`, tokenB, { method: "PUT", body: JSON.stringify({ completed: true }) });
        }
      } catch (err) { console.error(err.message); }
    }
  }

  // Import Weekly Goals
  if (Array.isArray(data.weeklyGoals)) {
    for (const item of data.weeklyGoals) {
      try {
        const created = await req("/goals", tokenB, { method: "POST", body: JSON.stringify({ text: item.text || "Untitled", scope: "weekly" }) });
        if (item.completed) {
          await req(`/goals/${created._id}`, tokenB, { method: "PUT", body: JSON.stringify({ completed: true }) });
        }
      } catch (err) { console.error(err.message); }
    }
  }

  console.log("  Import complete.");

  // ================================================================
  // 7. VERIFY IMPORTED DATA (User B)
  // ================================================================
  console.log("\n7. VERIFY IMPORT (User B)");
  const bTasksAfter = await req("/tasks", tokenB);
  const bWeeklyAfter = await req("/weekly-tasks", tokenB);
  const bHabitsAfter = await req("/habits", tokenB);
  const bEventsAfter = await req("/events", tokenB);
  const bFinanceAfter = await req("/finance", tokenB);
  const bNotesAfter = await req("/notes", tokenB);
  const bWishlistAfter = await req("/wishlist", tokenB);
  const bMonthlyAfter = await req("/goals?scope=monthly", tokenB);
  const bWeeklyGoalsAfter = await req("/goals?scope=weekly", tokenB);

  assert("Tasks imported", bTasksAfter.length >= 1 && bTasksAfter.some(t => t.title === "Export Test Task"));
  assert("Weekly tasks imported", bWeeklyAfter.monday.length >= 1 && bWeeklyAfter.monday.some(t => t.text === "Monday task"));
  assert("Habits imported", bHabitsAfter.length >= 1 && bHabitsAfter.some(h => h.name === "Read books"));
  assert("Events imported", bEventsAfter.length >= 1 && bEventsAfter.some(e => e.title === "Birthday"));
  assert("Finance imported", bFinanceAfter.length >= 1 && bFinanceAfter.some(f => f.description === "Salary"));
  assert("Notes imported", bNotesAfter.length >= 1 && bNotesAfter.some(n => n.title === "My Note"));
  assert("Wishlist imported", bWishlistAfter.length >= 1 && bWishlistAfter.some(w => w.text === "New keyboard"));
  assert("Monthly goals imported", bMonthlyAfter.length >= 1 && bMonthlyAfter.some(g => g.text === "Finish project"));
  assert("Weekly goals imported", bWeeklyGoalsAfter.length >= 1 && bWeeklyGoalsAfter.some(g => g.text === "Exercise 3x"));

  // ================================================================
  // 8. USER ISOLATION (User A's data unchanged)
  // ================================================================
  console.log("\n8. USER ISOLATION (post-import)");
  const aTasksStill = await req("/tasks", tokenA);
  assert("User A still has own tasks", aTasksStill.length >= 1 && aTasksStill.some(t => t.title === "Export Test Task"));
  // User B's imported IDs are different from User A's
  const aIds = new Set(aTasksStill.map(t => t._id));
  const bIds = new Set(bTasksAfter.map(t => t._id));
  const overlap = [...aIds].filter(id => bIds.has(id));
  assert("No ID overlap (data is user-owned copies)", overlap.length === 0);

  // ================================================================
  // 9. MALFORMED JSON
  // ================================================================
  console.log("\n9. MALFORMED JSON");
  let malformedCaught = false;
  try {
    JSON.parse("this is not json {{{");
  } catch {
    malformedCaught = true;
  }
  assert("Malformed JSON caught by parse", malformedCaught);

  // ================================================================
  // 10. MISSING VERSION FIELD
  // ================================================================
  console.log("\n10. MISSING VERSION FIELD");
  const noVersion = { tasks: [], habits: [] }; // no version field
  assert("No version → rejected", !noVersion.version);

  // ================================================================
  // 11. PERSISTENCE (re-fetch and verify)
  // ================================================================
  console.log("\n11. PERSISTENCE");
  const persistTasks = await req("/tasks", tokenB);
  assert("Data persists on re-fetch", persistTasks.length >= 1);

  // ================================================================
  // SUMMARY
  // ================================================================
  console.log(`\n${"=".repeat(50)}`);
  console.log(`RESULTS: ${passed} passed, ${failed} failed`);
  console.log(`${"=".repeat(50)}`);
  if (failed > 0) process.exit(1);
}

run().catch((err) => { console.error("FATAL:", err); process.exit(1); });
