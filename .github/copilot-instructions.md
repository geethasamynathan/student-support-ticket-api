# Copilot Instructions for Student Support Ticket API

## Project Overview

- Build a Node.js Express API for a student support ticket system.
- Students can create support tickets for training-related issues.
- Admins can view tickets and update their status.
- Use SQLite for local demo purposes.
- Use an external notification API for sending updates.

## Architecture Rules

- Use Express.js as the web framework.
- Keep routes in src/routes.
- Keep controllers in src/controllers.
- Keep business logic in src/services.
- Keep database logic in src/repositories.
- Keep database connection and schema in src/database.
- Keep API request examples in requests.
- Keep tests in tests.

## Coding Rules

- Use CommonJS require/module.exports.
- Use async/await for asynchronous code.
- Use clear and descriptive function names.
- Use meaningful error messages.
- Validate required fields before processing requests.
- Do not hard-code secrets.
- Read the external notification API URL from an environment variable.
- Keep code beginner-friendly and easy to follow.
- Mention created or updated files after changes.

## Testing Rules

- Use Jest and Supertest for automated tests.
- Include positive, negative, and edge-case tests.
- Do not skip error handling tests.
- Prefer simple and readable test cases.
