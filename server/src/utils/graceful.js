// server/src/utils/graceful.js
function runGracefulShutdown(server, mongooseConnection) {
  const shutdown = () => {
    console.log("Shutting down...");
    server.close(() => {
      console.log("HTTP server closed.");
      if (mongooseConnection) {
        mongooseConnection.connection.close(false, () => {
          console.log("Mongoose connection closed.");
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    });
    // force exit after 5s
    setTimeout(() => process.exit(1), 5000);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
module.exports = { runGracefulShutdown };
