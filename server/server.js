const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const taskRoutes = require("./routes/taskRoutes");
const habitRoutes = require("./routes/habitRoutes");
const eventRoutes = require("./routes/eventRoutes");
const financeRoutes = require("./routes/financeRoutes");
const noteRoutes = require("./routes/noteRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const goalRoutes = require("./routes/goalRoutes");
const weeklyTaskRoutes = require("./routes/weeklyTaskRoutes");
const journalRoutes = require("./routes/journalRoutes");

dotenv.config({ path: path.join(__dirname, ".env") });

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

/* =========================
   MIDDLEWARE
========================= */

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/weekly-tasks", weeklyTaskRoutes);
app.use("/api/journal", journalRoutes);

/* =========================
   FRONTEND ROUTING
========================= */

if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  // Serve static files from the React frontend app if not on Vercel
  app.use(express.static(path.join(__dirname, "../dist")));

  // Anything that doesn't match the above routes, send back index.html
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
} else {
  app.get("/api", (req, res) => {
    res.json({
      message: "Bullet Journal API is running ✦",
    });
  });
}

/* =========================
   START SERVER / EXPORT FOR VERCEL
========================= */

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless functions
module.exports = app;
