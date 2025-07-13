// File: frontend/src/components/AdvancedSearch.js

import React from 'react';

const styles = {
  sectionWrapper: {
    backgroundColor: '#83552d', // Secondary bg
    borderRadius: '16px',
    padding: '3rem',
    margin: '4rem auto',
    maxWidth: '1200px',
  },
  title: {
    textAlign: 'center',
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#f5e6c9', // Primary text
    marginBottom: '2.5rem',
  },
  form: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: '600',
    color: '#e1bb80', // Secondary text
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
  },
  input: {
    padding: '0.9rem 1rem',
    border: '1px solid #e1bb80',
    borderRadius: '8px',
    backgroundColor: '#f5e6c9',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '1rem',
    color: '#543512',
  },
  button: {
    gridColumn: '1 / -1',
    backgroundColor: '#ffae00',
    color: '#543512',
    border: 'none',
    borderRadius: '8px',
    padding: '1rem',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    marginTop: '1rem',
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
          </select>
        </div>
        <button style={styles.button}>Search</button>
      </form>
    </div>
  );
};

export default AdvancedSearch;