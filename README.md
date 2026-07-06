# Student Support Ticket API

## 1. Project overview
This project is a beginner-friendly backend API for a student support ticket system.

It allows you to:
- create support tickets for training-related issues
- view all tickets
- view one ticket by ID
- update a ticket status

The app uses Express.js and SQLite so it can run locally without a separate database server.

## 2. Tech stack
- Node.js
- Express.js
- SQLite
- dotenv for environment variables
- Jest and Supertest for testing

## 3. Folder structure
- src/ - application source code
  - controllers/ - request handlers
  - routes/ - API routes
  - services/ - business logic
  - repositories/ - database access code
  - database/ - SQLite setup and connection
- data/ - local SQLite database files
- tests/ - automated tests
- requests/ - sample HTTP requests

## 4. Environment variables
Create a .env file in the project root with values such as:

```env
PORT=3000
NOTIFICATION_API_URL=https://example.com/notify
```

Notes:
- PORT controls the local server port.
- NOTIFICATION_API_URL is used for the external notification call.

## 5. Setup steps
1. Make sure Node.js is installed.
2. Open the project folder in the terminal.
3. Install dependencies:

```bash
npm install
```

4. Create a .env file with the values above.

## 6. Run commands
Start the API locally:

```bash
npm start
```

If you use nodemon for development:

```bash
npm run dev
```

The app should be available at:

```text
http://localhost:3000
```

## 7. API endpoint table

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /health | Check if the API is running |
| POST | /api/tickets | Create a new ticket |
| GET | /api/tickets | Get all tickets |
| GET | /api/tickets/:id | Get one ticket by ID |
| PATCH | /api/tickets/:id/status | Update the status of a ticket |

## 8. Sample requests
### Create a ticket
```bash
curl -X POST http://localhost:3000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "student_name": "Amina",
    "email": "amina@example.com",
    "category": "Technical",
    "description": "I cannot access the training portal",
    "priority": "High"
  }'
```

### Get all tickets
```bash
curl http://localhost:3000/api/tickets
```

### Get one ticket
```bash
curl http://localhost:3000/api/tickets/1
```

### Update ticket status
```bash
curl -X PATCH http://localhost:3000/api/tickets/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"In Progress"}'
```

## 9. Test command
Run the automated tests with:

```bash
npm test
```

The tests cover positive cases, validation errors, and notification fallback behavior.

## 10. GitHub workflow explanation
This repository is set up to work well with GitHub collaboration:
- Use feature branches for new work.
- Open a pull request when your change is ready.
- Use the issue template for new feature requests.
- Use the pull request template to describe what changed and how it was tested.

This makes it easier for teammates to review changes and understand the purpose of each update.
