import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import DashboardSidebar from "../components/DashboardSidebar";
import "../styles/dashboard.css";
import UserManagement from "./UserManagement";
import BookManagement from "./BookManagement";
import BorrowHistoryPage from "./BorrowHistoryPage";
import ProfilePage from "./ProfilePage";

// Dashboard summary/home component
const DashboardHome = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h1>Welcome to the Librarium Dashboard!</h1>
    <p style={{ fontSize: '1.2rem', marginTop: '1.5rem' }}>
      Use the sidebar to manage users, books, and more.
    </p>
    <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '30px', borderRadius: '12px', color: 'white', minWidth: '220px' }}>
        <h3>Total Users</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>-</p>
      </div>
      <div style={{ background: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)', padding: '30px', borderRadius: '12px', color: 'white', minWidth: '220px' }}>
        <h3>Active Users</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>-</p>
      </div>
      <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '30px', borderRadius: '12px', color: 'white', minWidth: '220px' }}>
        <h3>Librarians</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>-</p>
      </div>
    </div>
  </div>
);


const DashboardPage = () => {
  // In a real app, get this from auth context or JWT
  const currentUserRole = "manager"; // or "librarian"
  const location = useLocation();

  const handleLogout = () => {
    console.log("Logout clicked");
    // future: redirect or clear auth
  };

  // Determine active menu based on current path
  const path = location.pathname;
  let activeMenu = "Dashboard";
  if (path.includes("/dashboard/users")) activeMenu = "Users";
  else if (path.includes("/dashboard/books")) activeMenu = "Books";
  else if (path.includes("/dashboard/borrow-history")) activeMenu = "Borrow History";
  else if (path.includes("/dashboard/profile")) activeMenu = "Profile";

  return (
    <div className="admin-dashboard">
      <DashboardSidebar active={activeMenu} onLogout={handleLogout} />
      <div className="main-content">
        <DashboardHeader username="Quyen" role={currentUserRole.charAt(0).toUpperCase() + currentUserRole.slice(1)} />
        <div className="content-container">
          <Routes>
            <Route path="/users" element={<UserManagement />} />
            <Route path="/books" element={<BookManagement />} />
            <Route path="/borrow-history" element={<BorrowHistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<DashboardHome />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
