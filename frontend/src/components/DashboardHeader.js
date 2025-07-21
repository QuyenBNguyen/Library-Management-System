import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

const DashboardHeader = () => {
  const [user, setUser] = useState({ email: "-", role: "-" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        let res;
        try {
          res = await axios.get("http://localhost:5000/members/profile/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch {}
        if (res && res.data && res.data.data) {
          setUser({
            email: res.data.data.email || "-",
            role: res.data.data.role || "-"
          });
        }
      } catch {
        setUser({ email: "-", role: "-" });
      }
    };
    fetchProfile();
  }, []);

  // Time and date
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });

  return (
    <div className="top-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="user-avatar">
          <span className="material-icons">person</span>
        </div>
        <div className="user-details">
          <div className="user-name" style={{ fontWeight: 600 }}>{user.email}</div>
          <div className="user-role" style={{ color: '#3b82f6', fontWeight: 500, fontSize: 13, letterSpacing: 1 }}>{user.role && user.role.toUpperCase()}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div className="time-info" style={{ textAlign: 'right' }}>
          <div className="time-display">{time}</div>
          <div className="date-display">{date}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
