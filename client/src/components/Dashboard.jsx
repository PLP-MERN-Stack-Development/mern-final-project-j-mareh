import React, { useEffect, useState } from "react";
import ReportCard from "./ReportCard";
import "../styles/dashboard.css";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState({ type: "All", status: "All", q: "" });

  useEffect(() => {
    let mounted = true;

    async function fetchReports() {
      const res = await fetch(`${API_BASE}/api/reports`, { credentials: "include" });
      const data = await res.json();
      if (mounted) setReports(data);
    }
    fetchReports();

    // listen to SSE global event to update list
    function onEvent(e) {
      const { type, payload } = e.detail || {};
      if (!type) return;
      if (type === "report_created") {
        setReports(prev => [payload, ...prev]);
      } else if (type === "report_updated") {
        setReports(prev => prev.map(r => (r.id === payload.id ? { ...r, ...payload } : r)));
      }
    }
    window.addEventListener("wajibu:event", onEvent);

    return () => {
      mounted = false;
      window.removeEventListener("wajibu:event", onEvent);
    };
  }, []);

  function applyFilters(items) {
    return items.filter((r) => {
      if (filter.type !== "All" && r.type !== filter.type) return false;
      if (filter.status !== "All" && r.status !== filter.status) return false;
      if (filter.q && !(
        (r.title || "").toLowerCase().includes(filter.q.toLowerCase()) ||
        (r.description || "").toLowerCase().includes(filter.q.toLowerCase()) ||
        (r.location || "").toLowerCase().includes(filter.q.toLowerCase())
      )) return false;
      return true;
    });
  }

  const visible = applyFilters(reports);
  const types = Array.from(new Set(reports.map(r => r.type))).filter(Boolean);

  return (
    <section className="dashboard">
      <div className="filters">
        <input
          aria-label="Search"
          className="search"
          placeholder="Search reports..."
          value={filter.q}
          onChange={(e) => setFilter(f => ({ ...f, q: e.target.value }))}
        />
        <select value={filter.type} onChange={(e) => setFilter(f => ({ ...f, type: e.target.value }))}>
          <option value="All">All Types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filter.status} onChange={(e) => setFilter(f => ({ ...f, status: e.target.value }))}>
          <option value="All">All Statuses</option>
          <option value="Pending Review">Pending Review</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="reports-list">
        {visible.length === 0 ? (
          <div className="empty-state">No reports found.</div>
        ) : (
          visible.map(r => <ReportCard key={r.id} report={r} />)
        )}
      </div>
    </section>
  );
}
