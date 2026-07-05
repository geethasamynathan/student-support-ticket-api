const express = require("express");
const ticketController = require("../controllers/ticketController");

const router = express.Router();

router.post("/", ticketController.createTicket);
router.get("/", ticketController.getAllTickets);
router.get("/:id", ticketController.getTicketById);
router.patch("/:id/status", ticketController.updateTicketStatus);

module.exports = router;
