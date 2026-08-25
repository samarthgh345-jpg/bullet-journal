const http = require('http');

async function testServer() {
  console.log("Checking if server responds...");
  const res = await fetch("http://localhost:5000/api");
  const data = await res.json();
  console.log("Response:", data);
  if (data.message === "Bullet Journal API is running ✦") {
    console.log("✅ Server responds successfully");
  } else {
    console.log("❌ Server failed to respond correctly");
  }
}

testServer().catch(console.error);
