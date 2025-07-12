import React from "react";
import DashboardHeader from "../components/DashboardHeader";
import DashboardSidebar from "../components/DashboardSidebar";
import "../../public/css/dashboard.css";

const DashboardPage = () => {
  const handleLogout = () => {
    console.log("Logout clicked");
    // future: redirect or clear auth
  };

  return (
    <div className="admin-dashboard">
      <DashboardSidebar active="Users" onLogout={handleLogout} />
      <div className="main-content">
        <DashboardHeader username="Quyen" role="Librarian" />

        {/* Content Header */}
        <div className="content-container">
          <div className="content-header">
            <h1 className="page-title">User Management</h1>
            <div className="content-actions">
              <button className="add-user-btn">
                <span className="material-icons">add_circle</span>
                Add User
              </button>
              <div className="search-bar">
                <span className="material-icons">search</span>
                <input type="text" placeholder="Search by ID or Name" />
              </div>
            </div>
          </div>

          {/* Placeholder for user table component */}
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* User rows will go here */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
