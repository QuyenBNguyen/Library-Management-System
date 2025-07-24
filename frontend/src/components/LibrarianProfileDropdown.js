import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const styles = {
  dropdown: {
    position: "relative",
    display: "inline-block",
  },
  dropbtn: {
    background: "none",
    border: "none",
    color: "#e1bb80",
    fontSize: "1rem",
    fontWeight: 500,
    cursor: "pointer",
    padding: 0,
  },
  dropdownContent: {
    display: "none",
    position: "absolute",
    backgroundColor: "#83552d",
    minWidth: "160px",
    boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
    zIndex: 1,
    right: 0,
    borderRadius: "8px",
    marginTop: "8px",
  },
  dropdownContentShow: {
    display: "block",
  },
  dropdownItem: {
    color: "#f5e6c9",
    padding: "12px 16px",
    textDecoration: "none",
    display: "block",
    background: "none",
    border: "none",
    width: "100%",
    textAlign: "left",
    fontSize: "1rem",
    cursor: "pointer",
  },
  dropdownItemHover: {
    backgroundColor: "#543512",
  },
};

const LibrarianProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Đóng dropdown khi click ra ngoài
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={styles.dropdown} ref={dropdownRef}>
      <button
        style={styles.dropbtn}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        Profile ▾
      </button>
      <div
        style={{
          ...styles.dropdownContent,
          ...(open ? styles.dropdownContentShow : {}),
        }}
      >
        <Link to="/librarian/profile" style={styles.dropdownItem}>
          Thông tin cá nhân
        </Link>
        <Link to="/librarian/change-password" style={styles.dropdownItem}>
          Đổi mật khẩu
        </Link>
        <button style={styles.dropdownItem} onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default LibrarianProfileDropdown;
