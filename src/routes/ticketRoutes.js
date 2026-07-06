const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const { initializeDatabase, getDb } = require("../database/db");

const router = express.Router();

function buildFilterQuery(query) {
  const validStatuses = ["Open", "In Progress", "Resolved", "Closed"];
  const validCategories = ["Technical", "Course", "Payment", "Certificate"];
  const filters = [];
  const values = [];

  if (query.status) {
    if (!validStatuses.includes(query.status)) {
      const error = new Error("Invalid status");
      error.statusCode = 400;
      throw error;
    }
    filters.push("status = ?");
    values.push(query.status);
  }

  if (query.category) {
    if (!validCategories.includes(query.category)) {
      const error = new Error("Invalid category");
      error.statusCode = 400;
      throw error;
    }
    filters.push("category = ?");
    values.push(query.category);
  }

  const whereClause =
    filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
  return { whereClause, values };
}

router.get("/", async (req, res, next) => {
  try {
    await initializeDatabase();
    const { whereClause, values } = buildFilterQuery(req.query);
    const query = `SELECT * FROM support_tickets ${whereClause} ORDER BY created_at DESC`;
    getDb().all(query, values, (err, rows) => {
      if (err) {
        next(err);
        return;
      }
      res.status(200).json(rows);
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    await initializeDatabase();
    const { student_name, email, category, description, priority } = req.body;

    if (!student_name || !email || !category || !description || !priority) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      throw error;
    }

    const validCategories = ["Technical", "Course", "Payment", "Certificate"];
    const validPriorities = ["Low", "Medium", "High"];

    if (!validCategories.includes(category)) {
      const error = new Error("Invalid category");
      error.statusCode = 400;
      throw error;
    }

    if (!validPriorities.includes(priority)) {
      const error = new Error("Invalid priority");
      error.statusCode = 400;
      throw error;
    }

    const now = new Date().toISOString();
    const query = `
      INSERT INTO support_tickets (student_name, email, category, description, priority, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'Open', ?, ?)
    `;

    getDb().run(
      query,
      [student_name, email, category, description, priority, now, now],
      function (err) {
        if (err) {
          next(err);
          return;
        }
        res.status(201).json({
          id: this.lastID,
          student_name,
          email,
          category,
          description,
          priority,
          status: "Open",
          created_at: now,
          updated_at: now,
        });
      },
    );
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    await initializeDatabase();
    const query = "SELECT * FROM support_tickets WHERE id = ?";
    getDb().get(query, [req.params.id], (err, row) => {
      if (err) {
        next(err);
        return;
      }
      if (!row) {
        const error = new Error("Ticket not found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(row);
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    await initializeDatabase();
    const validStatuses = ["Open", "In Progress", "Resolved", "Closed"];
    const { status } = req.body;

    if (!status || !validStatuses.includes(status)) {
      const error = new Error("Invalid status");
      error.statusCode = 400;
      throw error;
    }

    const updatedAt = new Date().toISOString();
    const query =
      "UPDATE support_tickets SET status = ?, updated_at = ? WHERE id = ?";
    getDb().run(query, [status, updatedAt, req.params.id], function (err) {
      if (err) {
        next(err);
        return;
      }
      if (this.changes === 0) {
        const error = new Error("Ticket not found");
        error.statusCode = 404;
        throw error;
      }
      res
        .status(200)
        .json({ id: Number(req.params.id), status, updated_at: updatedAt });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
