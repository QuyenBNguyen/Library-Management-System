// File: frontend/src/components/Layout.js

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    alignItems: "center",
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
  userDropdown: {
    position: "relative",
    display: "inline-block",
  },
  userButton: {
    background: "none",
    border: "none",
    color: "#e1bb80",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: 0,
  },
  dropdownContent: {
    position: "absolute",
    top: "100%",
    right: 0,
    backgroundColor: "#83552d",
    minWidth: "160px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    borderRadius: "8px",
    padding: "0.5rem 0",
    zIndex: 1000,
    marginTop: "0.5rem",
    animation: "fadeIn 0.2s ease-out",
  },
  dropdownItem: {
    color: "#e1bb80",
    padding: "0.5rem 1rem",
    textDecoration: "none",
    display: "block",
    transition: "background-color 0.2s, color 0.2s",
    cursor: "pointer",
  },
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(-10px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
};

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get user avatar (from localStorage user object)
  let avatarUrl = null;
  if (isLoggedIn) {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      avatarUrl = user && user.avatarUrl ? user.avatarUrl : null;
    } catch {
      avatarUrl = null;
    }
  }
  const defaultAvatar = "/images/avatar-placeholder.jpg";

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <Link to="/" style={styles.logo}>
          Librarium
        </Link>
        <nav style={styles.navLinks}>
          <Link
            to="/"
            style={styles.link}
            onMouseOver={(e) => (e.target.style.color = "#ffae00")}
            onMouseOut={(e) => (e.target.style.color = "#e1bb80")}
          >
            Home
          </Link>
          <Link
            to="/catalog"
            style={styles.link}
            onMouseOver={(e) => (e.target.style.color = "#ffae00")}
            onMouseOut={(e) => (e.target.style.color = "#e1bb80")}
          >
            Catalog
          </Link>
          {isLoggedIn ? (
            <div style={styles.userDropdown} ref={dropdownRef}>
              <button
                style={styles.userButton}
                onClick={toggleDropdown}
                onMouseOver={(e) => (e.target.style.color = "#ffae00")}
                onMouseOut={(e) => (e.target.style.color = "#e1bb80")}
              >
                {<div>User</div>}

                {isDropdownOpen ? "▲" : "▼"}
              </button>
              {isDropdownOpen && (
                <div
                  style={{
                    ...styles.dropdownContent,
                    animation: "fadeIn 0.2s ease-out",
                  }}
                >
                  <Link
                    to="/profile"
                    style={styles.dropdownItem}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#6b4424";
                      e.target.style.color = "#ffae00";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#e1bb80";
                    }}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/change-password"
                    style={styles.dropdownItem}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#6b4424";
                      e.target.style.color = "#ffae00";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#e1bb80";
                    }}
                  >
                    Change Password
                  </Link>
                  <Link
                    to="/borrow-history"
                    style={styles.dropdownItem}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#6b4424";
                      e.target.style.color = "#ffae00";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#e1bb80";
                    }}
                  >
                    Borrow History
                  </Link>
                  <div
                    style={styles.dropdownItem}
                    onClick={handleLogout}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#6b4424";
                      e.target.style.color = "#ffae00";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#e1bb80";
                    }}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                style={styles.link}
                onMouseOver={(e) => (e.target.style.color = "#ffae00")}
                onMouseOut={(e) => (e.target.style.color = "#e1bb80")}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={styles.link}
                onMouseOver={(e) => (e.target.style.color = "#ffae00")}
                onMouseOut={(e) => (e.target.style.color = "#e1bb80")}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </header>
      <main style={styles.content}>{children}</main>
      <footer style={styles.footer}>
        <div>
          <a href="/about" style={styles.contactLink}>
            About Us
          </a>
          <a href="/contact" style={styles.contactLink}>
            Contact
          </a>
          <a href="/faq" style={styles.contactLink}>
            FAQ
          </a>
        </div>
        <div style={styles.copyright}>
          © 2024 Librarium. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
