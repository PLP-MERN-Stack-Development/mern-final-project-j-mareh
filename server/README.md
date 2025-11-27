# Wajibu Backend (server)

1. cd server
2. npm install
3. copy .env from provided content and adjust MONGO_URI and MODERATOR_API_KEY
4. npm run dev   # uses nodemon
5. Server listens on PORT (default 4000)

Endpoints:
- POST /api/auth/anonymous  -> { uid } (cookie set)
- GET  /api/reports         -> list reports
- POST /api/reports        -> create report
- PUT  /api/reports/:id/status  -> moderator update (x-api-key header)
- GET  /api/stream         -> SSE real-time stream


// server/src/index.js
require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const { runGracefulShutdown } = require("./utils/graceful");

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI not set in .env");
  process.exit(1);
}

mongoose.set("strictQuery", false);

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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




  import React, { useState } from "react";
import "../styles/modal.css";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function SubmitModal({ onClose, user }) {
  const [form, setForm] = useState({
    title: "",
    type: "Corruption",
    location: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) return setError("Please enter a title.");
    if (!form.description.trim()) return setError("Please enter a description.");

    const reporterId =
      localStorage.getItem("wajibu_uid") || (user && user.uid);

    if (!reporterId)
      return setError("Missing user id; reload the page and try again.");

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/reports`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, reporterId })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submit failed");
      }

      setLoading(false);
      onClose();
    } catch (err) {
      console.error("submit error", err);
      setError(err.message || "Failed to submit");
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <h3>Submit Report</h3>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              name="title"
              value={form.title}
              onChange={updateField}
            />
          </label>

          <label>
            Type
            <select
              name="type"
              value={form.type}
              onChange={updateField}
            >
              <option>Corruption</option>
              <option>Poor Service Delivery</option>
              <option>Infrastructure</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Location
            <input
              name="location"
              value={form.location}
              onChange={updateField}
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              rows="5"
            />
          </label>

          {error && <div className="form-error">{error}</div>}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
