const { getDb } = require("../database/db");

function createTicket(ticket) {
  return new Promise((resolve, reject) => {
    const {
      student_name,
      email,
      category,
      description,
      priority,
      status,
      created_at,
      updated_at,
    } = ticket;
    const query = `
      INSERT INTO support_tickets (student_name, email, category, description, priority, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    getDb().run(
      query,
      [
        student_name,
        email,
        category,
        description,
        priority,
        status,
        created_at,
        updated_at,
      ],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: this.lastID, ...ticket });
      },
    );
  });
}

function getAllTickets() {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM support_tickets ORDER BY created_at DESC";
    getDb().all(query, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

function getTicketById(id) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM support_tickets WHERE id = ?";
    getDb().get(query, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
}

function updateTicketStatus(id, status, updated_at) {
  return new Promise((resolve, reject) => {
    const query =
      "UPDATE support_tickets SET status = ?, updated_at = ? WHERE id = ?";
    getDb().run(query, [status, updated_at, id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      if (this.changes === 0) {
        resolve(null);
        return;
      }
      resolve({ id, status, updated_at });
    });
  });
}

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
};
