const app = require("./src/app");

const PORT = process.env.PORT || 3000;

async function startServer() {
  const { initializeDatabase } = require("./src/database/db");
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
