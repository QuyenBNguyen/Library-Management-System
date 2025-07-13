import React from "react";
import "../styles/dashboard.css";

const menuItems = [
  { label: "Dashboard", icon: "dashboard" },
  { label: "Catalog", icon: "auto_stories" },
  { label: "Books", icon: "menu_book" },
  { label: "Users", icon: "people" },
  { label: "Borrow History", icon: "history" },
  { label: "Branches", icon: "account_balance" },
  { label: "Profile", icon: "person" }
];

const DashboardSidebar = ({ active = "Dashboard", onLogout }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img
            src="/images/bookworm-logo.svg"
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
            onClick={() => {
              if (item.label === "Profile") {
                window.location.href = "/profile";
              } else if (item.label === "Borrow History") {
                window.location.href = "/borrow-history";
              } else if (item.label === "Books") {
                window.location.href = "/books";
              }
            }}
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
