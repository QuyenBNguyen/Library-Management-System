import React from "react";
import { Link, Outlet, Navigate } from "react-router-dom";
import LibrarianProfileDropdown from "../components/LibrarianProfileDropdown";

const styles = {
  body: {
    backgroundColor: "#543512", // Primary bg
    fontFamily: "'Poppins', sans-serif",
    color: "#f5e6c9", // Primary text
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: "#83552d", // Secondary bg
    padding: "1rem 4rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  },
  logo: {
    color: "#f5e6c9",
    textDecoration: "none",
    fontSize: "1.8rem",
    fontWeight: "700",
  },
  navLinks: {
    display: "flex",
    gap: "2.5rem",
  },
  link: {
    color: "#e1bb80", // Secondary text
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "color 0.2s",
  },
  footer: {
    backgroundColor: "#83552d",
    color: "#e1bb80",
    padding: "1.5rem 4rem",
    textAlign: "center",
    marginTop: "auto",
  },
  contactLink: {
    color: "#f5e6c9",
    textDecoration: "none",
    margin: "0 1rem",
  },
  copyright: {
    fontSize: "0.8rem",
    marginTop: "1rem",
    color: "#e1bb80",
  },
};

const LibrarianLayout = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "librarian") {
    return <Navigate to="/" replace />;
  }
  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <Link to="/librarian" style={styles.logo}>
          Librarium
        </Link>
        <nav style={styles.navLinks}>
          <Link
            to="/librarian"
            style={styles.link}
            onMouseOver={(e) => (e.target.style.color = "#f5e6c9")}
            onMouseOut={(e) => (e.target.style.color = "#e1bb80")}
          >
            Dashboard
          </Link>
          <Link
            to="/librarian/books"
            style={styles.link}
            onMouseOver={(e) => (e.target.style.color = "#f5e6c9")}
            onMouseOut={(e) => (e.target.style.color = "#e1bb80")}
          >
            Manage Books
          </Link>

          <Link
            to="/librarian/loans"
            style={styles.link}
            onMouseOver={(e) => (e.target.style.color = "#f5e6c9")}
            onMouseOut={(e) => (e.target.style.color = "#e1bb80")}
          >
            Loans
          </Link>

          <Link
            to="/librarian/payment-history"
            style={styles.link}
            onMouseOver={(e) => (e.target.style.color = "#f5e6c9")}
            onMouseOut={(e) => (e.target.style.color = "#e1bb80")}
          >
            Payments History
          </Link>

          <LibrarianProfileDropdown />
        </nav>
      </header>
      <main style={styles.content}>
        <Outlet />
      </main>
      <footer style={styles.footer}>
        <div>
          <a href="mailto:info@librarium.com" style={styles.contactLink}>
            info@librarium.com
          </a>
          <a href="https://www.librarium.com" style={styles.contactLink}>
            www.librarium.com
          </a>
        </div>
        <p style={styles.copyright}>
          © {new Date().getFullYear()} – Librarium. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LibrarianLayout;
