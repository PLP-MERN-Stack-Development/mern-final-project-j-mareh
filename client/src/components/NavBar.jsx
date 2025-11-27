import React from "react";
import "../styles/navbar.css";

export default function NavBar({ user, onOpenSubmit }) {
  return (
    <nav className="nav">
      <div className="nav-left">
        <div className="brand">Wajibu</div>
      </div>
      <div className="nav-right">
        <button className="nav-btn" onClick={onOpenSubmit}>Submit</button>
        <div className="user-id">
          {user ? <span title="Anonymous UID">uid: {user.uid}</span> : <span>Signing in...</span>}
        </div>
      </div>
    </nav>
  );
}
