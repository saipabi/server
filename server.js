require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const logoutRoutes = require("./routes/logoutRoutes");

const app = express();

// ---- FRONTEND URL ----
const FRONTEND_URL = process.env.CLIENT_ORIGIN || "https://logginnpag.netlify.app";

// ---- CORS ----
const allowedOrigins = [
  FRONTEND_URL,
  FRONTEND_URL.endsWith("/") ? FRONTEND_URL.slice(0, -1) : FRONTEND_URL + "/",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
];

console.log("Allowed origins at startup:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (!allowedOrigins.includes(origin)) {
        console.log("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"), false);
      }

      return callback(null, true);
    },
    credentials: true,
  })
);

// ---- BODY PARSERS ----
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- DATABASE ----
connectDB();

// ---- ROUTES ----
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/logout", logoutRoutes);

// ---- HEALTH ----
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// ---- ERROR HANDLER ----
app.use((err, req, res, next) => {
  console.error("Error:", err.message || err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ---- SERVER ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✔ Server running on port ${PORT}`);
  console.log(`✔ Allowed frontend: ${FRONTEND_URL}`);
});
