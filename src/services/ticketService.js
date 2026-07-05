const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
} = require("../repositories/ticketRepository");
const { sendNotification } = require("./notificationService");

const validCategories = ["Technical", "Course", "Payment", "Certificate"];
const validPriorities = ["Low", "Medium", "High"];
const validStatuses = ["Open", "In Progress", "Resolved", "Closed"];

function validateTicketPayload(payload) {
  const requiredFields = [
    "student_name",
    "email",
    "category",
    "description",
    "priority",
  ];
  const missingFields = requiredFields.filter((field) => !payload[field]);

  if (missingFields.length > 0) {
    const error = new Error(
      `Missing required fields: ${missingFields.join(", ")}`,
    );
    error.statusCode = 400;
    throw error;
  }

  if (!validCategories.includes(payload.category)) {
    const error = new Error(
      `Invalid category. Allowed values: ${validCategories.join(", ")}`,
    );
    error.statusCode = 400;
    throw error;
  }

  if (!validPriorities.includes(payload.priority)) {
    const error = new Error(
      `Invalid priority. Allowed values: ${validPriorities.join(", ")}`,
    );
    error.statusCode = 400;
    throw error;
  }

  if (!payload.email.includes("@")) {
    const error = new Error("Email must be a valid email address");
    error.statusCode = 400;
    throw error;
  }
}

function validateStatus(payload) {
  if (!payload.status) {
    const error = new Error("Status is required");
    error.statusCode = 400;
    throw error;
  }

  if (!validStatuses.includes(payload.status)) {
    const error = new Error(
      `Invalid status. Allowed values: ${validStatuses.join(", ")}`,
    );
    error.statusCode = 400;
    throw error;
  }
}

async function createNewTicket(payload) {
  validateTicketPayload(payload);

  const now = new Date().toISOString();
  const ticket = {
    student_name: payload.student_name,
    email: payload.email,
    category: payload.category,
    description: payload.description,
    priority: payload.priority,
    status: "Open",
    created_at: now,
    updated_at: now,
  };

  const createdTicket = await createTicket(ticket);

  try {
    await sendNotification(createdTicket);
  } catch (error) {
    console.warn("Notification service failed:", error.message);
  }

  return createdTicket;
}

async function getTickets() {
  return getAllTickets();
}

async function getTicket(id) {
  const ticket = await getTicketById(id);
  if (!ticket) {
    const error = new Error("Ticket not found");
    error.statusCode = 404;
    throw error;
  }
  return ticket;
}

async function updateTicketStatusById(id, payload) {
  validateStatus(payload);
  const now = new Date().toISOString();
  const updated = await updateTicketStatus(id, payload.status, now);

  if (!updated) {
    const error = new Error("Ticket not found");
    error.statusCode = 404;
    throw error;
  }

  return { id: Number(id), status: payload.status, updated_at: now };
}

module.exports = {
  createNewTicket,
  getTickets,
  getTicket,
  updateTicketStatusById,
  validCategories,
  validPriorities,
  validStatuses,
};
