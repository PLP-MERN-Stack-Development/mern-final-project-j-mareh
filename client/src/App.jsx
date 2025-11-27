import React, { useEffect, useState, useRef } from "react";
import NavBar from "./components/NavBar";
import Dashboard from "./components/Dashboard";
import SubmitModal from "./components/SubmitModal";
import Analytics from "./components/Analytics";
import "./styles/dashboard.css";

// ✅ Set backend URL properly
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function App() {
  const [user, setUser] = useState(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    // ✅ Safe anonymous auth
    async function ensureAnon() {
      try {
        const stored = localStorage.getItem("wajibu_uid");

        const res = await fetch(`${API_BASE}/api/auth/anonymous`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        // ✅ Avoid JSON crashes
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        const uid = data.uid || stored;
        if (uid) {
          localStorage.setItem("wajibu_uid", uid);
          setUser({ uid });
        }
      } catch (err) {
        console.error("Auth failed", err);
      }
    }

    ensureAnon();

    // ✅ Safe SSE connection
    const es = new EventSource(`${API_BASE}/api/stream`, {
      withCredentials: true,
    });

    es.onmessage = (ev) => {
      try {
        const obj = JSON.parse(ev.data);
        window.dispatchEvent(new CustomEvent("wajibu:event", { detail: obj }));
      } catch (e) {
        // ignore invalid messages
      }
    };

    es.onerror = () => {
      // EventSource auto-reconnects
    };

    eventSourceRef.current = es;

    return () => {
      try {
        es.close();
      } catch (e) {}
    };
  }, []);

  return (
    <div className="app-root">
      <NavBar user={user} onOpenSubmit={() => setShowSubmit(true)} />

      <main className="main-content">
        <div className="left-column">
          <header className="page-header">
            <h1>Wajibu — Public Reports</h1>
            <p className="subtitle">
              Transparency and citizen accountability — real-time feed
            </p>
          </header>
          <Dashboard user={user} />
        </div>

        <aside className="right-column">
          <button
            className="submit-cta"
            onClick={() => setShowSubmit(true)}
          >
            Submit Report
          </button>

          <Analytics />

          <div className="help-box">
            <h3>How it works</h3>
            <ol>
              <li>Open the app — you’ll be signed in anonymously.</li>
              <li>Click “Submit Report” to share an incident publicly.</li>
              <li>Moderators can update status using the moderator API.</li>
            </ol>
          </div>
        </aside>
      </main>

      {showSubmit && (
        <SubmitModal
          onClose={() => setShowSubmit(false)}
          user={user}
          apiBase={API_BASE}
        />
      )}
    </div>
  );
}

