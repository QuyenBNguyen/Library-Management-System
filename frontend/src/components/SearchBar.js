// File: frontend/src/components/SearchBar.js

import React from 'react';

// Style object based on the CSS you provided
const styles = {
  searchWrapper: {
    padding: '2rem 0',
    backgroundColor: '#F5F5DC', // Beige background for the whole section
  },
  searchBar: {
    maxWidth: '700px',
    margin: '0 auto',
    backgroundColor: '#F5F5DC', // Re-apply for context
    borderRadius: '10px',
    padding: '12px',
    display: 'flex',
    gap: '8px',
    border: '1px solid #D2B48C', // Add a subtle border
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #D2B48C',
    borderRadius: '8px',
    fontFamily: "'Lora', serif",
    fontSize: '1rem',
  },
  button: {
    backgroundColor: '#8B4513',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "'Lato', sans-serif",
    fontWeight: 'bold',
  }
};

const SearchBar = () => {
  return (
    <div style={styles.searchWrapper}>
        <div style={styles.searchBar}>
            <input 
                type="text" 
                style={styles.input} 
                placeholder="Search by title, author, or keyword" 
            />
            <button style={styles.button}>Search</button>
        </div>
    </div>
  );
};

export default SearchBar;