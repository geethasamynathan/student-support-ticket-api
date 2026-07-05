const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ticketRoutes = require("./routes/ticketRoutes");
const { initializeDatabase } = require("./database/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/tickets", ticketRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
  });
});

initializeDatabase().catch((err) => {
  console.error("Failed to initialize database:", err);
});

module.exports = app;
