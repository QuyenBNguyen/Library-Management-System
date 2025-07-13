// File: frontend/src/components/CategorySidebar.js

import React from 'react';

const styles = {
  // THU GỌN CHIỀU RỘNG
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
};

const categories = ["Editor's Picks", "Featured Sellers", "First Edition Books", "Signed Books", 'Fiction', 'Science Fiction', 'Fantasy' ];

const CategorySidebar = () => (
  <aside style={styles.sidebar}>
    <div style={styles.section}>
      <h2 style={styles.title}>Browse Collections</h2>
      <ul style={styles.list}>
        {categories.map(category => (
          <li key={category} style={styles.listItem}>
            <button style={styles.buttonLink} onMouseOver={e => e.target.style.color='#ffae00'} onMouseOut={e => e.target.style.color='#e1bb80'}>
              {category}
            </button>
          </li>
        ))}
      </ul>
    </div>
  </aside>
);

export default CategorySidebar;