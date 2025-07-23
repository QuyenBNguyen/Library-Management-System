// File: frontend/src/pages/BookDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookApi from '../../api/bookApi';

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
    status: { fontSize: '0.9rem', fontWeight: '600', padding: '0.4rem 1rem', borderRadius: '20px', display: 'inline-block', marginBottom: '1rem' },
    statusAvailable: { backgroundColor: 'rgba(92, 184, 92, 0.2)', color: '#5cb85c', border: '1px solid #5cb85c' },
    statusCheckedOut: { backgroundColor: 'rgba(217, 83, 79, 0.2)', color: '#d9534f', border: '1px solid #d9534f' },
    statusReserved: { backgroundColor: 'rgba(255, 174, 0, 0.2)', color: '#ffae00', border: '1px solid #ffae00' },
    statusOther: { backgroundColor: 'rgba(100,100,100,0.1)', color: '#543512', border: '1px solid #543512' },
    label: { fontWeight: '600', color: '#83552d', marginRight: '0.5rem' },
    value: { color: '#543512' },
    descriptionSection: { marginTop: '1.5rem', borderTop: '1px solid #e1bb80', paddingTop: '1.5rem' },
    sectionTitle: { fontSize: '1.5rem', fontWeight: '700', color: '#83552d', marginBottom: '1rem' },
    description: { fontSize: '1rem', lineHeight: 1.8, whiteSpace: 'pre-line' },
    borrowButton: { backgroundColor: '#ffae00', color: '#543512', border: 'none', borderRadius: '8px', padding: '0.8rem 2.5rem', cursor: 'pointer', fontWeight: '700', fontSize: '1.1rem', marginTop: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'background 0.2s' },
    borrowButtonDisabled: { backgroundColor: '#e1bb80', color: '#a18b5b', cursor: 'not-allowed' },
    feedback: { marginTop: '1.5rem', fontWeight: '600', fontSize: '1.1rem' },
};

const getStatusStyle = (status) => {
  if (status === 'available') return styles.statusAvailable;
  if (status === 'checked out') return styles.statusCheckedOut;
  if (status === 'reserved') return styles.statusReserved;
  return styles.statusOther;
};

const BookDetailPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Get user role from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role);
      } catch {
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, []);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await bookApi.getById(bookId);
        setBook(res.data);
      } catch (err) {
        setError('Failed to load book details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);

  const handleBorrow = async () => {
    // Restrict: only logged-in member can borrow
    if (!userRole) {
      navigate('/login');
      return;
    }
    if (userRole !== 'member') {
      setFeedback('Only members can reserve books.');
      return;
    }
    if (!book) return;
    setBorrowLoading(true);
    setFeedback("");
    try {
      const updated = { ...book, status: 'reserved' };
      await bookApi.update(book._id || book.id, updated);
      setBook((prev) => ({ ...prev, status: 'reserved' }));
      setFeedback('Book reserved successfully!');
    } catch (err) {
      setFeedback('Failed to reserve book.');
    } finally {
      setBorrowLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', color: '#543512', margin: '2rem' }}>Loading book details...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red', margin: '2rem' }}>{error}</div>;
  if (!book) return null;

  return (
    <div style={styles.pageWrapper}>
      <button style={styles.backButton} onClick={() => navigate(-1)} title="Back to list">←</button>
      <div style={styles.detailContainer}>
        <img src={book.imageUrl || '/default-book.jpg'} alt={book.title} style={styles.coverImage} />
        <div style={styles.infoContainer}>
          <div style={styles.title}>{book.title}</div>
          <div style={styles.author}>by {book.author}</div>
          <div style={{ ...styles.status, ...getStatusStyle(book.status) }}>{book.status}</div>
          <div><span style={styles.label}>Genre:</span><span style={styles.value}>{book.genre}</span></div>
          <div><span style={styles.label}>ISBN:</span><span style={styles.value}>{book.ISBN}</span></div>
          <div><span style={styles.label}>Publisher:</span><span style={styles.value}>{book.publisher || 'N/A'}</span></div>
          <div><span style={styles.label}>Published:</span><span style={styles.value}>{book.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : 'N/A'}</span></div>
          <div><span style={styles.label}>Created at:</span><span style={styles.value}>{book.createdAt ? new Date(book.createdAt).toLocaleDateString() : 'N/A'}</span></div>
          <div style={styles.descriptionSection}>
            <div style={styles.sectionTitle}>Description</div>
            <div style={styles.description}>{book.summary || 'No description available.'}</div>
          </div>
          <button
            style={{
              ...styles.borrowButton,
              ...(book.status !== 'available' ? styles.borrowButtonDisabled : {}),
            }}
            onClick={handleBorrow}
            disabled={book.status !== 'available' || borrowLoading}
          >
            {borrowLoading ? 'Reserving...' : book.status === 'reserved' ? 'Reserved' : 'Borrow'}
          </button>
          {feedback && <div style={{ ...styles.feedback, color: feedback.includes('success') ? '#5cb85c' : '#d9534f' }}>{feedback}</div>}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;