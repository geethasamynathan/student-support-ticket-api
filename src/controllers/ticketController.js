const ticketService = require("../services/ticketService");

async function createTicket(req, res, next) {
  try {
    const ticket = await ticketService.createNewTicket(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
}

async function getAllTickets(req, res, next) {
  try {
    const tickets = await ticketService.getTickets();
    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
}

async function getTicketById(req, res, next) {
  try {
    const ticket = await ticketService.getTicket(req.params.id);
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
}

async function updateTicketStatus(req, res, next) {
  try {
    const ticket = await ticketService.updateTicketStatusById(
      req.params.id,
      req.body,
    );
    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
};
