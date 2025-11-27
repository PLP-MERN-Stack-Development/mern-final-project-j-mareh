// server/src/middleware/moderatorAuth.js
module.exports = function moderatorAuth(req, res, next) {
  const role = req.headers["x-user-role"];

  if (role !== "moderator") {
    return res.status(403).json({ error: "Access denied – Moderator only" });
  }

  next();
};

