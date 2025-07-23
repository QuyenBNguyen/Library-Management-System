// File: frontend/src/components/CategorySidebar.js

import React from 'react';

const ALL_GENRES = [
  "Fiction",
  "Mystery",
  "Fantasy",
  "Romance",
  "Science Fiction",
  "Horror",
  "Biography",
  "History",
  "Self-help",
  "Children",
  "Poetry",
  "Philosophy",
  "Business",
  "Travel",
];

const styles = {
  sidebar: {
    width: '220px',
    flexShrink: 0,
    paddingRight: '2rem',
  },
  section: { marginBottom: '2rem' },
  title: { fontFamily: "'Poppins', sans-serif", fontSize: '1.2rem', fontWeight: '600', color: '#f5e6c9', borderBottom: '1px solid #83552d', paddingBottom: '0.8rem', marginBottom: '1rem' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { padding: '0.5rem 0' },
  buttonLink: { background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', textDecoration: 'none', color: '#e1bb80', fontFamily: "'Poppins', sans-serif", fontSize: '1rem', transition: 'color 0.2s' },
  buttonActive: { color: '#ffae00', fontWeight: '700' },
};

const CategorySidebar = ({ selectedCategory, onSelectCategory }) => (
  <aside style={styles.sidebar}>
    <div style={styles.section}>
      <h2 style={styles.title}>Browse Genres</h2>
      <ul style={styles.list}>
        <li style={styles.listItem}>
          <button
            style={{ ...styles.buttonLink, ...(selectedCategory === null ? styles.buttonActive : {}) }}
            onClick={() => onSelectCategory(null)}
            onMouseOver={e => e.target.style.color='#ffae00'}
            onMouseOut={e => e.target.style.color = selectedCategory === null ? '#ffae00' : '#e1bb80'}
          >
            All Genres
          </button>
        </li>
        {ALL_GENRES.map(category => (
          <li key={category} style={styles.listItem}>
            <button
              style={{ ...styles.buttonLink, ...(selectedCategory === category ? styles.buttonActive : {}) }}
              onClick={() => onSelectCategory(category)}
              onMouseOver={e => e.target.style.color='#ffae00'}
              onMouseOut={e => e.target.style.color = selectedCategory === category ? '#ffae00' : '#e1bb80'}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </div>
  </aside>
);

export default CategorySidebar;