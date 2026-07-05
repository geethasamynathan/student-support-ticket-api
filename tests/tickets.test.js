const fs = require("fs");
const path = require("path");
const request = require("supertest");

jest.mock("axios");

describe("Student Support Ticket API", () => {
  let app;
  let server;
  let axios;

  beforeEach(async () => {
    jest.resetModules();
    axios = require("axios");
    process.env.DB_PATH = path.join(
      __dirname,
      "..",
      "data",
      "test-support-tickets.db",
    );
    process.env.NOTIFICATION_API_URL = "https://example.com/notify";

    if (fs.existsSync(process.env.DB_PATH)) {
      fs.unlinkSync(process.env.DB_PATH);
    }

    app = require("../src/app");
    const { initializeDatabase } = require("../src/database/db");
    await initializeDatabase();

    axios.post.mockReset();
    axios.post.mockResolvedValue({ status: 200 });
  });

  afterEach(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      server = null;
    }

    try {
      const { closeDb } = require("../src/database/db");
      await closeDb();
    } catch (error) {
      if (error.message !== "Database is not open") {
        throw error;
      }
    }
  });

  test("creates a ticket and returns it", async () => {
    const response = await request(app).post("/api/tickets").send({
      student_name: "Amina",
      email: "amina@example.com",
      category: "Technical",
      description: "Login issue on the training portal",
      priority: "High",
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      student_name: "Amina",
      category: "Technical",
      status: "Open",
    });
    expect(response.body.id).toBeDefined();
  });

  test("lists tickets and returns created tickets", async () => {
    await request(app).post("/api/tickets").send({
      student_name: "Amina",
      email: "amina@example.com",
      category: "Technical",
      description: "Login issue",
      priority: "High",
    });

    const response = await request(app).get("/api/tickets");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  test("gets a ticket by id", async () => {
    const created = await request(app).post("/api/tickets").send({
      student_name: "Amina",
      email: "amina@example.com",
      category: "Course",
      description: "Need module access",
      priority: "Medium",
    });

    const response = await request(app).get(`/api/tickets/${created.body.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(created.body.id);
  });

  test("updates ticket status", async () => {
    const created = await request(app).post("/api/tickets").send({
      student_name: "Amina",
      email: "amina@example.com",
      category: "Payment",
      description: "Invoice issue",
      priority: "Low",
    });

    const response = await request(app)
      .patch(`/api/tickets/${created.body.id}/status`)
      .send({ status: "In Progress" });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("In Progress");
  });

  test("returns bad request for invalid category", async () => {
    const response = await request(app).post("/api/tickets").send({
      student_name: "Amina",
      email: "amina@example.com",
      category: "Invalid",
      description: "Test",
      priority: "High",
    });

    expect(response.status).toBe(400);
  });

  test("still creates ticket when notification service fails", async () => {
    axios.post.mockRejectedValueOnce(new Error("network error"));
    const consoleWarnSpy = jest
      .spyOn(console, "warn")
      .mockImplementation(() => {});

    const response = await request(app).post("/api/tickets").send({
      student_name: "Amina",
      email: "amina@example.com",
      category: "Certificate",
      description: "Need certificate",
      priority: "Medium",
    });

    expect(response.status).toBe(201);
    expect(consoleWarnSpy).toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
  });
});
