import React from "react";
import "../styles/dashboard.css";

const DashboardHeader = ({ username = "Admin User", role = "Manager" }) => {
  // Format time and date (static for now, can use useEffect to update)
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });

  return (
    <div className="top-header">
      <div className="user-info" onClick={() => window.location.href = "/profile"} style={{ cursor: "pointer" }}>
        <div className="user-avatar">
          <span className="material-icons">person</span>
        </div>
        <div className="user-details">
          <div className="user-name">{username}</div>
          <div className="user-role">{role}</div>
        </div>
      </div>

      <div className="time-info">
        <div className="time-display">{time}</div>
        <div className="date-display">{date}</div>
      </div>

      <span className="material-icons settings-icon">settings</span>
    </div>
  );
};

export default DashboardHeader;
