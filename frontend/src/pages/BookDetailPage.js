// File: frontend/src/pages/BookDetailPage.js

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { findBookById } from '../data/mockData';

// Component nhỏ để vẽ sao
const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return <span style={{ color: '#ffae00', fontSize: '1.2rem', verticalAlign: 'middle' }}>{'★'.repeat(fullStars)}{'☆'.repeat(emptyStars)}</span>;
}

const styles = {
    pageWrapper: { padding: '2rem 4rem', position: 'relative' },
    backButton: {
        position: 'absolute', top: '3rem', left: '1.5rem', background: '#ffae00', border: 'none',
        borderRadius: '50%', width: '45px', height: '45px', cursor: 'pointer', display: 'flex',
        alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        transition: 'transform 0.2s', color: '#543512', fontSize: '24px',
    },
    detailContainer: { display: 'flex', gap: '4rem', padding: '3rem', maxWidth: '1200px', margin: '2rem auto', backgroundColor: '#f5e6c9', borderRadius: '16px', color: '#543512', border: '1px solid #83552d' },
    coverImage: { width: '350px', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', flexShrink: 0 },
    infoContainer: { display: 'flex', flexDirection: 'column', flex: 1 },
    title: { fontSize: '2.8rem', fontWeight: '700', lineHeight: 1.2, marginBottom: '0.5rem' },
    author: { fontSize: '1.4rem', fontWeight: '500', color: '#83552d', marginBottom: '1rem' },
    ratingStatusWrapper: { display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
    rating: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' },
    status: { fontSize: '0.9rem', fontWeight: '600', padding: '0.4rem 1rem', borderRadius: '20px' },
    statusAvailable: { backgroundColor: 'rgba(92, 184, 92, 0.2)', color: '#5cb85c', border: '1px solid #5cb85c' },
    statusCheckedOut: { backgroundColor: 'rgba(217, 83, 79, 0.2)', color: '#d9534f', border: '1px solid #d9534f' },
    descriptionSection: { marginTop: '1.5rem', borderTop: '1px solid #e1bb80', paddingTop: '1.5rem' },
    sectionTitle: { fontSize: '1.5rem', fontWeight: '700', color: '#83552d', marginBottom: '1rem' },
    description: { fontSize: '1rem', lineHeight: 1.8, whiteSpace: 'pre-line' },
    quote: { borderLeft: '4px solid #ffae00', paddingLeft: '1.5rem', margin: '1.5rem 0', fontStyle: 'italic', fontSize: '1.1rem', color: '#83552d' },
    actionButtons: { display: 'flex', gap: '1rem', margin: '1.5rem 0' },
    button: { backgroundColor: '#ffae00', color: '#543512', border: 'none', borderRadius: '8px', padding: '0.8rem 1.5rem', cursor: 'pointer', fontWeight: '600' },
    reviewCard: { borderTop: '1px solid #e1bb80', padding: '1.5rem 0' },
    reviewHeader: { display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' },
    reviewUser: { fontWeight: '700' },
    reviewComment: { color: '#543512' }
};

const BookDetailPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const book = findBookById(bookId);

  if (!book) { return <div style={{textAlign: 'center', padding: '5rem', color: '#f5e6c9'}}><h2>404: Book Not Found!</h2></div>; }

  return (
    <div style={styles.pageWrapper}>
      <button onClick={() => navigate(-1)} style={styles.backButton} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} title="Go Back">
        &larr;
      </button>

      <div style={styles.detailContainer}>
        <img src={book.imageUrl} alt={book.title} style={styles.coverImage} />
        <div style={styles.infoContainer}>
          <h1 style={styles.title}>{book.title}</h1>
          <h3 style={styles.author}>by {book.author}</h3>

          <div style={styles.ratingStatusWrapper}>
            <div style={styles.rating}>
              <StarRating rating={book.rating} /> <strong>{book.rating}</strong> ({book.totalRatings} ratings)
            </div>
            <span style={{...styles.status, ...(book.status === 'Available' ? styles.statusAvailable : styles.statusCheckedOut)}}>
              {book.status}
            </span>
          </div>
          
          <div style={styles.descriptionSection}>
            <h2 style={styles.sectionTitle}>Summary</h2>
            <p style={styles.description}>{book.description}</p>
            <blockquote style={styles.quote}>"{book.quote}"</blockquote>
          </div>

          <div style={styles.actionButtons}>
            <button style={styles.button}>Add to Bookshelf</button>
            <button style={styles.button}>Write a Review</button>
            <button style={styles.button}>Share</button>
          </div>

          <div style={styles.descriptionSection}>
            <h2 style={styles.sectionTitle}>Reader Reviews</h2>
            {book.reviews.length > 0 ? (
              book.reviews.map((review, index) => (
                <div key={index} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <strong style={styles.reviewUser}>{review.user}</strong>
                    <StarRating rating={review.stars} />
                  </div>
                  <p style={styles.reviewComment}>{review.comment}</p>
                </div>
              ))
            ) : (
              <p>There are no reviews for this book yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;