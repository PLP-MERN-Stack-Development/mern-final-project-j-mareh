import React from "react";
import "../styles/reportCard.css";

function statusClass(status) {
  switch (status) {
    case "In Progress": return "status-progress";
    case "Resolved": return "status-resolved";
    default: return "status-pending";
  }
}

export default function ReportCard({ report }) {
  const date = report.timestamp ? new Date(report.timestamp * 1000) : new Date();
  return (
    <article className="report-card">
      <div className="card-header">
        <div className="card-type">{report.type || "General"}</div>
        <div className={`card-status ${statusClass(report.status)}`}>{report.status}</div>
      </div>

      <h2 className="card-title">{report.title}</h2>

      <div className="card-meta">
        <span className="card-location">{report.location}</span>
        <span className="card-date">{date.toLocaleString()}</span>
      </div>

      <p className="card-desc">{report.description}</p>

      <div className="card-footer">
        <span className="reporter">Reporter: {report.reporterId}</span>
        <span className="report-id">#{report.id.slice(0,6)}</span>
      </div>
    </article>
  );
}
