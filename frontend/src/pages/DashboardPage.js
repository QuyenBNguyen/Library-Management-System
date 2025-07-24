import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import DashboardSidebar from "../components/DashboardSidebar";
import "../styles/dashboard.css";
import UserManagement from "./UserManagement";
import BookManagement from "./BookManagement";
import BorrowHistoryPage from "./BorrowHistoryPage";
import ProfilePage from "../pages/Member/ProfilePage";
import BorrowSessionDetailPage from "./BorrowSessionDetailPage";
import axios from "axios";

// Dashboard summary/home component
const DashboardHome = ({ userRole }) => {
  const [stats, setStats] = useState({
    members: 0,
    librarians: 0,
    books: 0,
    checkedOut: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      setStats((s) => ({ ...s, loading: true }));
      try {
        const token = localStorage.getItem("token");
        // Fetch users
        const usersRes = await axios.get("http://localhost:5000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const users = usersRes.data.data || [];
        const members = users.filter((u) => u.role === "member").length;
        const librarians = users.filter((u) => u.role === "librarian").length;
        // Fetch books
        const booksRes = await axios.get("http://localhost:5000/api/books", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const books = booksRes.data.data || booksRes.data || [];
        // Fetch borrow sessions
        const borrowRes = await axios.get(
          "http://localhost:5000/api/borrow/history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Count all books with status 'checked out'
        let checkedOut = 0;
        (books || []).forEach((b) => {
          if (b.status === "checked out") checkedOut++;
        });
        setStats({
          members,
          librarians,
          books: books.length,
          checkedOut,
          loading: false,
        });
      } catch (err) {
        setStats((s) => ({ ...s, loading: false }));
      }
    };
    fetchStats();
  }, []);

  if (userRole === "manager") {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Welcome, Manager!</h1>
        <p style={{ fontSize: "1.2rem", marginTop: "1.5rem" }}>
          You can view books and borrow history.
        </p>
        <div
          style={{
            marginTop: "3rem",
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)",
              padding: "30px",
              borderRadius: "12px",
              color: "white",
              minWidth: "220px",
            }}
          >
            <h3>Books</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {stats.loading ? "-" : stats.books}
            </p>
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #ffb347 0%, #ffcc33 100%)",
              padding: "30px",
              borderRadius: "12px",
              color: "white",
              minWidth: "220px",
            }}
          >
            <h3>Checked Out</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {stats.loading ? "-" : stats.checkedOut}
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (userRole === "librarian") {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Welcome, Librarian!</h1>
        <p style={{ fontSize: "1.2rem", marginTop: "1.5rem" }}>
          You can manage books, members, and borrow history.
        </p>
        <div
          style={{
            marginTop: "3rem",
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "30px",
              borderRadius: "12px",
              color: "white",
              minWidth: "220px",
            }}
          >
            <h3>Members</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {stats.loading ? "-" : stats.members}
            </p>
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              padding: "30px",
              borderRadius: "12px",
              color: "white",
              minWidth: "220px",
            }}
          >
            <h3>Librarians</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {stats.loading ? "-" : stats.librarians}
            </p>
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)",
              padding: "30px",
              borderRadius: "12px",
              color: "white",
              minWidth: "220px",
            }}
          >
            <h3>Books</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {stats.loading ? "-" : stats.books}
            </p>
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #ffb347 0%, #ffcc33 100%)",
              padding: "30px",
              borderRadius: "12px",
              color: "white",
              minWidth: "220px",
            }}
          >
            <h3>Checked Out</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {stats.loading ? "-" : stats.checkedOut}
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Welcome to the Librarium Dashboard!</h1>
      <p style={{ fontSize: "1.2rem", marginTop: "1.5rem" }}>
        Your role does not have access to dashboard stats.
      </p>
    </div>
  );
};

const DashboardPage = () => {
  const [userRole, setUserRole] = useState("member");
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch user role
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(
          "http://localhost:5000/members/profile/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data && res.data.data && res.data.data.role) {
          setUserRole(res.data.data.role);
        }
      } catch {
        setUserRole("member");
      }
    };
    fetchRole();
  }, []);

  // Redirect to login if role is not allowed
  useEffect(() => {
    if (userRole && userRole !== "manager" && userRole !== "librarian") {
      navigate("/login");
    }
  }, [userRole, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Determine active menu based on current path
  const path = location.pathname;
  let activeMenu = "Dashboard";
  if (path.includes("/dashboard/users")) activeMenu = "Users";
  else if (path.includes("/dashboard/books")) activeMenu = "Books";
  else if (path.includes("/dashboard/borrow-history"))
    activeMenu = "Borrow History";
  else if (path.includes("/dashboard/profile")) activeMenu = "Profile";

  return (
    <div className="admin-dashboard">
      <DashboardSidebar active={activeMenu} onLogout={handleLogout} />
      <div className="main-content">
        <DashboardHeader />
        <div className="content-container">
          <Routes>
            <Route path="/users" element={<UserManagement />} />
            <Route
              path="/books"
              element={<BookManagement userRole={userRole} />}
            />
            <Route
              path="/borrow-history"
              element={<BorrowHistoryPage userRole={userRole} />}
            />
            <Route
              path="/borrow-history/:sessionId"
              element={<BorrowSessionDetailPage />}
            />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<DashboardHome userRole={userRole} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
