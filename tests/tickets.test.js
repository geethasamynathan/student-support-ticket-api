const request = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("../src/app");
const { initializeDatabase, getDb } = require("../src/database/db");

describe("GET /api/tickets filters", () => {
  beforeEach(async () => {
    const dbPath =
      process.env.DB_PATH ||
      path.join(__dirname, "..", "data", "support-tickets.db");
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    await initializeDatabase();

    const tickets = [
      {
        student_name: "Amina",
        email: "amina@example.com",
        category: "Technical",
        description: "Login issue",
        priority: "High",
        status: "Open",
        created_at: "2024-01-01T00:00:00.000Z",
        updated_at: "2024-01-01T00:00:00.000Z",
      },
      {
        student_name: "Ben",
        email: "ben@example.com",
        category: "Course",
        description: "Need module",
        priority: "Medium",
        status: "In Progress",
        created_at: "2024-01-02T00:00:00.000Z",
        updated_at: "2024-01-02T00:00:00.000Z",
      },
    ];

    const insertQuery = `
      INSERT INTO support_tickets (student_name, email, category, description, priority, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const ticket of tickets) {
      await new Promise((resolve, reject) => {
        getDb().run(
          insertQuery,
          [
            ticket.student_name,
            ticket.email,
            ticket.category,
            ticket.description,
            ticket.priority,
            ticket.status,
            ticket.created_at,
            ticket.updated_at,
          ],
          function (err) {
            if (err) {
              reject(err);
              return;
            }
            resolve();
          },
        );
      });
    }
  });

  test("returns all tickets when no filters are provided", async () => {
    const response = await request(app).get("/api/tickets");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test("returns tickets matching the provided status", async () => {
    const response = await request(app)
      .get("/api/tickets")
      .query({ status: "Open" });
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].status).toBe("Open");
  });

  test("returns tickets matching the provided category", async () => {
    const response = await request(app)
      .get("/api/tickets")
      .query({ category: "Course" });
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].category).toBe("Course");
  });

  test("applies both status and category filters together", async () => {
    const response = await request(app)
      .get("/api/tickets")
      .query({ status: "Open", category: "Technical" });
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].status).toBe("Open");
    expect(response.body[0].category).toBe("Technical");
  });

  test("returns 400 for invalid status", async () => {
    const response = await request(app)
      .get("/api/tickets")
      .query({ status: "Unknown" });
    expect(response.status).toBe(400);
  });

  test("returns 400 for invalid category", async () => {
    const response = await request(app)
      .get("/api/tickets")
      .query({ category: "Unknown" });
    expect(response.status).toBe(400);
  });
});
