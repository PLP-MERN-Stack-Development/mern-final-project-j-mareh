// server/src/index.js
require("dotenv").config();
const mongoose = require("mongoose"); // import mongoose
const app = require("./app");
const { runGracefulShutdown } = require("./utils/graceful");

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI not set in .env");
  process.exit(1);
}

// optional: disable strict query warnings
mongoose.set("strictQuery", false);

// connect to MongoDB (no deprecated options)
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB:", MONGO_URI);

    const server = app.listen(PORT, () => {
      console.log(`Wajibu backend running on http://localhost:${PORT}`);
    });

    // graceful shutdown helpers
    runGracefulShutdown(server, mongoose);
  })
  .catch(err => {
    console.error("Mongo connection error:", err);
    process.exit(1);
  });
