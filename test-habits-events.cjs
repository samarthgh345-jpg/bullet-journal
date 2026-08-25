const http = require('http');

async function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api' + path,
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log("--- HABITS & EVENTS API TEST ---");
  
  const userA = { name: "User A", email: `usera_${Date.now()}@test.com`, password: "password123" };
  const userB = { name: "User B", email: `userb_${Date.now()}@test.com`, password: "password123" };
  
  const tokenA = (await request('POST', '/auth/register', userA)).body.token;
  const tokenB = (await request('POST', '/auth/register', userB)).body.token;

  // --- HABITS ---
  console.log("\\n--- HABITS ---");
  const createHabitRes = await request('POST', '/habits', { name: "Test Habit", frequency: "daily" }, tokenA);
  const habitId = createHabitRes.body._id;
  console.log(createHabitRes.status === 201 ? "PASS Create Habit" : "FAIL Create Habit");

  const readHabitsRes = await request('GET', '/habits', null, tokenA);
  console.log(readHabitsRes.body.length === 1 ? "PASS Read Habit" : "FAIL Read Habit");

  const toggleRes = await request('POST', `/habits/${habitId}/toggle`, { date: "2026-08-23" }, tokenA);
  console.log(toggleRes.status === 200 && toggleRes.body.completedDates.includes("2026-08-23") ? "PASS Toggle Habit" : "FAIL Toggle Habit");

  const crossReadHabit = await request('GET', '/habits', null, tokenB);
  console.log(crossReadHabit.body.length === 0 ? "PASS Habit Isolation (Read)" : "FAIL Habit Isolation (Read)");

  const crossToggleHabit = await request('POST', `/habits/${habitId}/toggle`, { date: "2026-08-23" }, tokenB);
  console.log(crossToggleHabit.status === 404 ? "PASS Habit Isolation (Toggle blocked)" : "FAIL Habit Isolation (Toggle blocked)");

  const delHabitRes = await request('DELETE', `/habits/${habitId}`, null, tokenA);
  console.log(delHabitRes.status === 200 ? "PASS Delete Habit" : "FAIL Delete Habit");

  const invHabit = await request('POST', '/habits', { name: "" }, tokenA);
  console.log(invHabit.status === 400 ? "PASS Habit Validation (Empty name)" : "FAIL Habit Validation");


  // --- EVENTS ---
  console.log("\\n--- EVENTS ---");
  const createEventRes = await request('POST', '/events', { title: "Test Event", date: "2026-08-23", description: "Desc", type: "event" }, tokenA);
  const eventId = createEventRes.body._id;
  console.log(createEventRes.status === 201 ? "PASS Create Event" : "FAIL Create Event");

  const readEventsRes = await request('GET', '/events', null, tokenA);
  console.log(readEventsRes.body.length === 1 ? "PASS Read Event" : "FAIL Read Event");

  const crossReadEvent = await request('GET', '/events', null, tokenB);
  console.log(crossReadEvent.body.length === 0 ? "PASS Event Isolation (Read)" : "FAIL Event Isolation (Read)");

  const crossDelEvent = await request('DELETE', `/events/${eventId}`, null, tokenB);
  console.log(crossDelEvent.status === 404 ? "PASS Event Isolation (Delete blocked)" : "FAIL Event Isolation (Delete blocked)");

  const delEventRes = await request('DELETE', `/events/${eventId}`, null, tokenA);
  console.log(delEventRes.status === 200 ? "PASS Delete Event" : "FAIL Delete Event");

  const invEvent = await request('POST', '/events', { title: "" }, tokenA);
  console.log(invEvent.status === 400 ? "PASS Event Validation (Empty title)" : "FAIL Event Validation");
  
  const invDateEvent = await request('POST', '/events', { title: "No Date Event" }, tokenA);
  console.log(invDateEvent.status === 400 ? "PASS Event Validation (Empty date)" : "FAIL Event Validation");
  
  console.log("\\nTests complete.");
}
runTests();
