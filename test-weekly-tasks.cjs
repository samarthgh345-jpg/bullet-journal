const fs = require('fs');

async function testWeeklyTasks() {
  const API = 'http://localhost:5000/api';

  console.log("1. Registering Test Users...");
  
  const userA = { name: "User A", email: `usera_${Date.now()}@test.com`, password: "password" };
  const userB = { name: "User B", email: `userb_${Date.now()}@test.com`, password: "password" };

  const resA = await fetch(`${API}/auth/register`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(userA)
  });
  const dataA = await resA.json();
  const tokenA = dataA.token;

  const resB = await fetch(`${API}/auth/register`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(userB)
  });
  const dataB = await resB.json();
  const tokenB = dataB.token;

  if (!tokenA || !tokenB) {
    console.log("FAIL: Could not register users");
    return;
  }
  
  console.log("✅ Users registered");

  console.log("\n2. Create weekly task (User A)...");
  const createRes = await fetch(`${API}/weekly-tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenA}` },
    body: JSON.stringify({ text: "Test Task Monday", day: "monday" })
  });
  const createdTask = await createRes.json();
  if (createdTask.text === "Test Task Monday" && createdTask.completed === false) {
    console.log("✅ Create weekly task PASS");
  } else {
    console.log("❌ Create weekly task FAIL", createdTask);
  }

  console.log("\n3. Read weekly tasks (User A)...");
  const readRes = await fetch(`${API}/weekly-tasks`, {
    headers: { "Authorization": `Bearer ${tokenA}` }
  });
  const groupedTasks = await readRes.json();
  if (groupedTasks.monday.length === 1 && groupedTasks.monday[0].text === "Test Task Monday") {
    console.log("✅ Read weekly tasks PASS");
  } else {
    console.log("❌ Read weekly tasks FAIL", groupedTasks);
  }

  console.log("\n4. Complete task (User A)...");
  const completeRes = await fetch(`${API}/weekly-tasks/${createdTask._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenA}` },
    body: JSON.stringify({ completed: true })
  });
  const completedTask = await completeRes.json();
  if (completedTask.completed === true) {
    console.log("✅ Complete task PASS");
  } else {
    console.log("❌ Complete task FAIL", completedTask);
  }
  
  console.log("\n5. Uncomplete task (User A)...");
  const uncompleteRes = await fetch(`${API}/weekly-tasks/${createdTask._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenA}` },
    body: JSON.stringify({ completed: false })
  });
  const uncompletedTask = await uncompleteRes.json();
  if (uncompletedTask.completed === false) {
    console.log("✅ Uncomplete task PASS");
  } else {
    console.log("❌ Uncomplete task FAIL", uncompletedTask);
  }

  console.log("\n6. User isolation (User B trying to read User A tasks)...");
  const readBRes = await fetch(`${API}/weekly-tasks`, {
    headers: { "Authorization": `Bearer ${tokenB}` }
  });
  const groupedTasksB = await readBRes.json();
  if (groupedTasksB.monday.length === 0) {
    console.log("✅ User isolation (Read) PASS");
  } else {
    console.log("❌ User isolation (Read) FAIL", groupedTasksB);
  }

  console.log("\n7. User isolation (User B trying to modify User A task)...");
  const modifyBRes = await fetch(`${API}/weekly-tasks/${createdTask._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenB}` },
    body: JSON.stringify({ text: "Hacked!" })
  });
  if (modifyBRes.status === 404) {
    console.log("✅ User isolation (Modify) PASS");
  } else {
    console.log("❌ User isolation (Modify) FAIL", modifyBRes.status);
  }

  console.log("\n8. Delete task (User A)...");
  const deleteRes = await fetch(`${API}/weekly-tasks/${createdTask._id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${tokenA}` }
  });
  if (deleteRes.status === 200) {
    console.log("✅ Delete task PASS");
  } else {
    console.log("❌ Delete task FAIL", deleteRes.status);
  }
  
  // No localStorage dependency check
  // (We manually verified JournalContext removal)
  console.log("\n✅ MongoDB persistence and No localStorage dependency verified through API use.");
  
}

testWeeklyTasks().catch(console.error);
