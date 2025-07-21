import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const menuItems = [
  { label: "Dashboard", icon: "dashboard", path: "/dashboard" },
  { label: "Books", icon: "menu_book", path: "/dashboard/books" },
  { label: "Users", icon: "people", path: "/dashboard/users" },
  { label: "Borrow History", icon: "history", path: "/dashboard/borrow-history" },
  { label: "Profile", icon: "person", path: "/dashboard/profile" }
];

const DashboardSidebar = ({ active = "Dashboard", onLogout }) => {
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img
            src={require("../images/bookworm-logo-dark.svg")}
            alt="BookWorm Library"
            width="180"
            height="110"
          />
        </div>
      </div>
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className={`menu-item${active === item.label ? " active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="material-icons menu-icon">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="menu-item" id="logoutButton" onClick={onLogout}>
          <span className="material-icons menu-icon">logout</span>
          Log Out
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
