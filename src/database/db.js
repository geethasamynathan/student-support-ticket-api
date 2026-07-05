const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath =
  process.env.DB_PATH ||
  path.join(__dirname, "..", "..", "data", "support-tickets.db");

if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `
        CREATE TABLE IF NOT EXISTS support_tickets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_name TEXT NOT NULL,
          email TEXT NOT NULL,
          category TEXT NOT NULL,
          description TEXT NOT NULL,
          priority TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'Open',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `,
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        },
      );
    });
  });
}

function getDb() {
  return db;
}

module.exports = {
  initializeDatabase,
  getDb,
};
