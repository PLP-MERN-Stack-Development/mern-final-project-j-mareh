// server/src/routes/auth.js
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

const COOKIE_NAME = process.env.COOKIE_NAME || "wajibu_uid";
const COOKIE_MAX_AGE = parseInt(process.env.COOKIE_MAX_AGE || "31536000000", 10); // ms

// POST /api/auth/anonymous
router.post("/anonymous", (req, res) => {
  try {
    let uid = req.cookies && req.cookies[COOKIE_NAME];
    if (!uid) {
      uid = `anon_${uuidv4()}`;
      // set HttpOnly cookie for safety, still return uid in JSON so client can use it
      res.cookie(COOKIE_NAME, uid, {
        httpOnly: true,
        sameSite: "lax",
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
        maxAge: COOKIE_MAX_AGE
      });
    }
    return res.json({ uid });
  } catch (err) {
    return res.status(500).json({ error: "anonymous auth failed" });
  }
});

module.exports = router;
