# Student Support Ticket API

A beginner-friendly Node.js and Express API for managing student support tickets with SQLite.

## Features
- Create support tickets
- List all tickets
- Get a ticket by ID
- Update ticket status
- Send a notification when a ticket is created
- Graceful handling when the notification service fails

## Requirements
- Node.js 18+
- npm

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with:
   ```env
   PORT=3000
   NOTIFICATION_API_URL=https://example.com/notify
   ```

## Run the app
```bash
node server.js
```

Or with nodemon:
```bash
npx nodemon server.js
```

## Run tests
```bash
npm test
```

## API Endpoints
- POST /api/tickets
- GET /api/tickets
- GET /api/tickets/:id
- PATCH /api/tickets/:id/status
