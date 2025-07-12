// File: frontend/src/components/BookCard.js

import React from 'react';

const styles = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #dee2e6', 
    transition: 'transform 0.3s, box-shadow 0.3s',
    width: '250px', // KÍCH THƯỚC LỚN HƠN
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  },
  coverImage: {
    width: '100%',
    height: '320px', // Ảnh cao hơn
    objectFit: 'cover',
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: '1.2rem',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '0.5rem',
    minHeight: '55px',
  },
  author: {
    fontSize: '0.9rem',
    color: '#6c757d',
    marginBottom: '1.2rem',
    flexGrow: 1,
  },
  button: {
    backgroundColor: '#00BCD4',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '0.7rem',
    width: '100%',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s',
  },
};

const BookCard = ({ title, author, imageUrl }) => {
  return (
    <div 
      style={styles.card}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
      }}
    >
      <img src={imageUrl} alt={`Cover for ${title}`} style={styles.coverImage} />
      <div style={styles.content}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.author}>by {author}</p>
        <button style={styles.button} onMouseOver={e => e.target.style.backgroundColor='#0097A7'} onMouseOut={e => e.target.style.backgroundColor='#00BCD4'}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default BookCard;