// File: frontend/src/components/Layout.js

import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
  // General
  body: {
    backgroundColor: '#F4F6F8',
    fontFamily: "'Poppins', sans-serif",
    color: '#333333',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // Đảm bảo footer luôn ở cuối trang
  },
  content: {
    flex: 1, // Đẩy footer xuống dưới
  },
  // Header
  header: {
    backgroundColor: '#FFFFFF',
    padding: '1rem 4rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  logo: {
    color: '#0D47A1',
    textDecoration: 'none',
    fontSize: '1.8rem',
    fontWeight: '700',
  },
  navLinks: {
    display: 'flex',
    gap: '2.5rem',
  },
  link: {
    color: '#333333',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    paddingBottom: '5px',
    position: 'relative',
  },
  // --- FOOTER MỚI ---
  footer: {
    backgroundColor: '#0D47A1', // Nền xanh navy đậm
    color: '#BDBDBD', // Chữ màu xám nhạt
    padding: '1.5rem 4rem', // LÀM CHO FOOTER NHỎ LẠI
    marginTop: 'auto', // Tự động đẩy xuống cuối
    textAlign: 'center',
  },
  contactLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginBottom: '0.5rem',
  },
  contactLink: {
    color: '#E0E0E0', // Chữ sáng hơn một chút
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s',
  },
  copyright: {
    fontSize: '0.8rem',
  },
};

// Component Link với hiệu ứng
const NavLink = ({ to, children }) => {
    const [hover, setHover] = React.useState(false);
    return (
        <Link 
            to={to} 
            style={styles.link}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {children}
            <span style={{...styles.link, ...{
                content: '""',
                position: 'absolute',
                width: '100%',
                height: '2px',
                bottom: 0,
                left: 0,
                backgroundColor: '#00BCD4',
                transform: hover ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.3s ease-in-out',
            }}}></span>
        </Link>
    );
}

const Layout = ({ children }) => {
  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <Link to="/" style={styles.logo}>Librarium</Link>
        <nav style={styles.navLinks}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/catalog">Catalog</NavLink>
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
      </header>

      <main style={styles.content}>
        {children}
      </main>

      {/* --- FOOTER MỚI SIÊU GỌN --- */}
      <footer style={styles.footer}>
        <div style={styles.contactLinks}>
            <a href="mailto:info@librarium.com" style={styles.contactLink} onMouseOver={e=>e.target.style.color='#FFF'} onMouseOut={e=>e.target.style.color='#E0E0E0'}>info@librarium.com</a>
            <a href="https://www.librarium.com" style={styles.contactLink} onMouseOver={e=>e.target.style.color='#FFF'} onMouseOut={e=>e.target.style.color='#E0E0E0'}>www.librarium.com</a>
        </div>
        <p style={styles.copyright}>© {new Date().getFullYear()} – Librarium. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;