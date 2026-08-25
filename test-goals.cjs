const fs = require('fs');
const http = require('http');

async function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api' + path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          if (data) {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } else {
            resolve({ status: res.statusCode, body: null });
          }
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("--- GOALS API TEST ---");
  
  const userA = { name: "User A", email: `usera_${Date.now()}@test.com`, password: "password123" };
  const userB = { name: "User B", email: `userb_${Date.now()}@test.com`, password: "password123" };
  
  // Register A
  const regA = await request('POST', '/auth/register', userA);
  const tokenA = regA.body.token;
  console.log("User A registered");

  // Register B
  const regB = await request('POST', '/auth/register', userB);
  const tokenB = regB.body.token;
  console.log("User B registered");

  // Create Goal User A
  console.log("Creating goal for User A...");
  const createRes = await request('POST', '/goals', { text: "My Test Goal", scope: "monthly" }, tokenA);
  const goalId = createRes.body._id;
  console.log(createRes.status === 201 ? "PASS Create Goal" : "FAIL Create Goal");

  // Read Goals User A
  const readRes = await request('GET', '/goals?scope=monthly', null, tokenA);
  const found = readRes.body.find(g => g._id === goalId);
  console.log(found && found.text === "My Test Goal" ? "PASS Read Goals" : "FAIL Read Goals");

  // Edit Goal (Completion) User A
  const editRes = await request('PUT', `/goals/${goalId}`, { completed: true }, tokenA);
  console.log(editRes.status === 200 && editRes.body.completed === true ? "PASS Edit Goal" : "FAIL Edit Goal");

  // Cross-user Edit blocked
  const crossEditRes = await request('PUT', `/goals/${goalId}`, { text: "Hacked!" }, tokenB);
  console.log(crossEditRes.status === 404 ? "PASS Cross-user Edit blocked" : "FAIL Cross-user Edit blocked");
  
  // Cross-user Read blocked
  const crossReadRes = await request('GET', '/goals', null, tokenB);
  const crossFound = crossReadRes.body.find(g => g._id === goalId);
  console.log(!crossFound ? "PASS User Isolation" : "FAIL User Isolation");

  // Cross-user Delete blocked
  const crossDelRes = await request('DELETE', `/goals/${goalId}`, null, tokenB);
  console.log(crossDelRes.status === 404 ? "PASS Cross-user Delete blocked" : "FAIL Cross-user Delete blocked");

  // Invalid input (empty text)
  const invRes = await request('POST', '/goals', { text: "", scope: "monthly" }, tokenA);
  console.log(invRes.status === 400 ? "PASS Invalid input" : "FAIL Invalid input");

  // Delete Goal User A
  const delRes = await request('DELETE', `/goals/${goalId}`, null, tokenA);
  console.log(delRes.status === 200 ? "PASS Delete Goal" : "FAIL Delete Goal");
  
  // Verify it remains deleted
  const postDelReadRes = await request('GET', '/goals', null, tokenA);
  const postDelFound = postDelReadRes.body.find(g => g._id === goalId);
  console.log(!postDelFound ? "PASS Refresh persistence" : "FAIL Refresh persistence");

  console.log("Tests complete.");
}

runTests();
