// File: frontend/src/components/AdvancedSearch.js

import React from 'react';

// --- STYLES ---
const styles = {
  // Khung bao bọc đồng bộ với mục sách nổi bật
  sectionWrapper: {
    backgroundColor: '#E9ECEF', // NỀN XÁM TRẮNG
    borderRadius: '16px',
    padding: '3rem',
    margin: '4rem auto',
    maxWidth: '1200px', // Giảm độ rộng cho gọn hơn
    border: '1px solid #dee2e6',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.08)',
  },
  title: {
    textAlign: 'center',
    fontSize: '2.5rem',
    fontWeight: '700',
    fontFamily: "'Poppins', sans-serif",
    color: '#0D47A1',
    marginBottom: '2.5rem',
  },
  form: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // XẾP THÀNH 3 CỘT
    gap: '1.5rem', // GIẢM KHOẢNG CÁCH
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: '600',
    color: '#495057',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
  },
  input: {
    padding: '0.9rem 1rem',
    border: '1px solid #ced4da',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '1rem',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  // Nút bấm chiếm toàn bộ chiều rộng của form
  button: {
    gridColumn: '1 / -1',
    backgroundColor: '#0D47A1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '1rem',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    marginTop: '1rem', // Tạo khoảng cách với các ô ở trên
    transition: 'background-color 0.3s',
  },
};

const AdvancedSearch = () => {
  return (
    <div style={styles.sectionWrapper}>
      <h2 style={styles.title}>Refine Your Discovery</h2>
      <form style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="adv-title" style={styles.label}>Book Title</label>
          <input type="text" id="adv-title" style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="adv-author" style={styles.label}>Author</label>
          <input type="text" id="adv-author" style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="adv-genre" style={styles.label}>Genre</label>
          <select id="adv-genre" style={styles.input}>
            <option>All Genres</option>
            <option>Modern Literature</option>
            <option>Science Fiction</option>
            <option>Personal Development</option>
          </select>
        </div>
        <button style={styles.button} onMouseOver={e => e.target.style.backgroundColor='#0097A7'} onMouseOut={e => e.target.style.backgroundColor='#00BCD4'}>
          Search
        </button>
      </form>
    </div>
  );
};

export default AdvancedSearch;