// File: frontend/src/components/HeroSection.js

import React from 'react';

const styles = {
  hero: {
    // NOTE: Cậu có thể thay ảnh nền thư viện ở đây
    backgroundImage: `linear-gradient(rgba(84, 53, 18, 0.6), rgba(84, 53, 18, 0.6)), url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '120px 20px',
    textAlign: 'center',
    color: '#f5e6c9', // Primary text
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '700',
    textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
  },
};

const HeroSection = () => {
  return (
    <section style={styles.hero}>
      <h1 style={styles.title}>Discover Your Next Great Read</h1>
    </section>
  );
};

export default HeroSection;