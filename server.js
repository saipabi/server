// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const logoutRoutes = require("./routes/logoutRoutes");

const app = express();

const FRONTEND_URL = process.env.CLIENT_ORIGIN || "https://logginnpag.netlify.app";

const allowedOrigins = [
  FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin) return callback(null, true);

      if (!allowedOrigins.includes(origin)) {
        console.log("Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"), false);
      }

      return callback(null, true);
    },
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/logout", logoutRoutes);


app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message || err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed frontend: ${FRONTEND_URL}`);
});
