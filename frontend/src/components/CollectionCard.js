// File: frontend/src/components/CollectionCard.js

import React from 'react';

const styles = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(149, 157, 165, 0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  },
  imagesContainer: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr', // Chia 2 cột, cột trái lớn hơn
    gridTemplateRows: '1fr 1fr', // Chia 2 hàng
    gap: '4px',
    height: '220px',
  },
  mainImage: {
    gridColumn: '1 / 2', // Chiếm cột 1
    gridRow: '1 / 3', // Chiếm 2 hàng
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  subImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  info: {
    padding: '1rem 1.2rem',
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#0D47A1',
    margin: '0 0 0.25rem 0',
  },
  count: {
    fontSize: '0.9rem',
    color: '#6c757d',
    margin: 0,
  }
};

const CollectionCard = ({ collection }) => {
  const { name, count, images } = collection;
  
  return (
    <div 
      style={styles.card}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(149, 157, 165, 0.2)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(149, 157, 165, 0.1)';
      }}
    >
      <div style={styles.imagesContainer}>
        {/* NOTE: Thay ảnh ở đây */}
        <img src={images[0]} alt={name} style={styles.mainImage} />
        <img src={images[1]} alt="" style={styles.subImage} />
        <img src={images[2]} alt="" style={styles.subImage} />
      </div>
      <div style={styles.info}>
        <h3 style={styles.title}>{name}</h3>
        <p style={styles.count}>{count} books</p>
      </div>
    </div>
  );
};

export default CollectionCard;