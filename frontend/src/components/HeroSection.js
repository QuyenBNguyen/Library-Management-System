// File: frontend/src/components/HeroSection.js

import React from 'react';

const styles = {
  hero: {
    // NOTE: Cậu có thể thay ảnh nền ở đây
    backgroundImage: `linear-gradient(to right, rgba(13, 71, 161, 0.8), rgba(0, 188, 212, 0.7)), url('https://images.unsplash.com/photo-1558901357-ca41e027926b?w=1200&q=80')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '120px 4rem',
    color: '#FFFFFF',
  },
  content: {
    maxWidth: '700px',
  },
  title: {
    fontSize: '4rem',
    fontWeight: '700',
    lineHeight: '1.2',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.2rem',
    fontWeight: '400',
    marginBottom: '2rem',
    maxWidth: '500px',
    opacity: 0.9,
  },
  button: {
    backgroundColor: '#00BCD4', // Cyan
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '50px',
    padding: '1rem 2.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
};

const HeroSection = () => {
  return (
    <section style={styles.hero}>
      <div style={styles.content}>
        <h1 style={styles.title}>Discover Your Next Great Read</h1>
        <p style={styles.subtitle}>Explore a vast collection of books, from timeless classics to modern masterpieces.</p>
        <button 
          style={styles.button}
          onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 188, 212, 0.3)';
          }}
          onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Explore Catalog
        </button>
      </div>
    </section>
  );
};

export default HeroSection;