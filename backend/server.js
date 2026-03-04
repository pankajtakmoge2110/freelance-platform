const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─────────────────────────────────────────
// Routes rs
// ─────────────────────────────────────────
app.use("/api/auth",      require("./routes/auth"));
app.use("/api/projects",  require("./routes/projects"));
app.use("/api/bids",      require("./routes/bids"));
app.use("/api/messages",  require("./routes/messages"));
app.use("/api/contracts", require("./routes/contracts"));

// Health check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Freelance Platform API is running!",
  });
}); 

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({ success: false, message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});