// server/src/middleware/errorHandler.js
module.exports = function errorHandler(err, req, res, next) {
  console.error(err?.stack || err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
};
