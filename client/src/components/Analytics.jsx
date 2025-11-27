import React, { useEffect, useMemo, useState } from "react";
import "../styles/analytics.css";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function Analytics() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function fetchReports() {
      const res = await fetch(`${API_BASE}/api/reports`, { credentials: "include" });
      const data = await res.json();
      if (mounted) setReports(data);
    }
    fetchReports();

    function onEvent(e) {
      const { type, payload } = e.detail || {};
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

  const totals = useMemo(() => {
    const total = reports.length;
    const resolved = reports.filter(r => r.status === "Resolved").length;
    const pending = reports.filter(r => r.status === "Pending Review").length;
    const inProgress = reports.filter(r => r.status === "In Progress").length;
    const byType = reports.reduce((acc, r) => {
      const t = r.type || "Other";
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});
    return { total, resolved, pending, inProgress, byType };
  }, [reports]);

  return (
    <div className="analytics">
      <h3>Analytics Snapshot</h3>
      <div className="metrics">
        <div className="metric">
          <div className="metric-value">{totals.total}</div>
          <div className="metric-label">Total Reports</div>
        </div>
        <div className="metric">
          <div className="metric-value">{totals.resolved}</div>
          <div className="metric-label">Resolved</div>
        </div>
        <div className="metric">
          <div className="metric-value">{totals.pending}</div>
          <div className="metric-label">Pending</div>
        </div>
      </div>

      <div className="bar-chart">
        {Object.keys(totals.byType).length === 0 ? (
          <div className="empty-chart">No data</div>
        ) : (
          Object.entries(totals.byType).map(([type, count]) => {
            const pct = totals.total ? Math.round((count / totals.total) * 100) : 0;
            return (
              <div key={type} className="bar-row">
                <div className="bar-label">{type} <span className="bar-count">{count}</span></div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
