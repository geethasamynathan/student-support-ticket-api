const axios = require("axios");

async function sendNotification(ticket) {
  const url = process.env.NOTIFICATION_API_URL;

  if (!url) {
    throw new Error("NOTIFICATION_API_URL is not configured");
  }

  await axios.post(url, {
    ticket_id: ticket.id,
    student_name: ticket.student_name,
    status: ticket.status,
    message: `Ticket ${ticket.id} created successfully.`,
  });
}

module.exports = {
  sendNotification,
};
