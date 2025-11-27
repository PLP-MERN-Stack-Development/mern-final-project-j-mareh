import React, { useState } from "react";
import "../styles/modal.css";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function SubmitModal({ onClose }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    suspectName: "",
    suspectRole: "",
    corruptionType: "Corruption",
    corruptionDate: "",
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

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.errors?.[0]?.msg || "Submit failed");
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
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>

          <label>
            Full Name
            <input name="fullName" value={form.fullName} onChange={updateField}/>
          </label>

          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={updateField}/>
          </label>

          <label>
            Phone
            <input name="phone" value={form.phone} onChange={updateField}/>
          </label>

          <label>
            Suspect Name
            <input name="suspectName" value={form.suspectName} onChange={updateField}/>
          </label>

          <label>
            Suspect Role
            <input name="suspectRole" value={form.suspectRole} onChange={updateField}/>
          </label>

          <label>
            Corruption Type
            <select name="corruptionType" value={form.corruptionType} onChange={updateField}>
              <option>Corruption</option>
              <option>Poor Service Delivery</option>
              <option>Infrastructure</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Date of Incident
            <input type="date" name="corruptionDate" value={form.corruptionDate} onChange={updateField}/>
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
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

