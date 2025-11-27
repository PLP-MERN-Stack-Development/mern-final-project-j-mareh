// server/src/app.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const routesAuth = require("./routes/auth");
const routesReports = require("./routes/reports");
const sse = require("./sse");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);

app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

// CORS allowing credentials
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.length === 0) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error("CORS not allowed"), false);
  },
  credentials: true
}));

// Routes
app.use("/api/auth", routesAuth);
app.use("/api/reports", routesReports);

// SSE stream endpoint (attach as GET /api/stream)
app.get("/api/stream", sse.streamHandler);

// Health
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Error handler last
app.use(errorHandler);

module.exports = app;
