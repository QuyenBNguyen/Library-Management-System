import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BorrowHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/loans/history', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setHistory(response.data.data || []);
      } catch (err) {
        setError('Failed to fetch borrow history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', background: '#f5e6c9', borderRadius: 16, padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
      <h2 style={{ color: '#543512', fontFamily: 'Poppins, sans-serif', fontWeight: 700, marginBottom: '1.5rem' }}>Borrow History</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: '#d32f2f', background: '#ffebee', padding: '1rem', borderRadius: 8 }}>{error}</div>
      ) : history.length === 0 ? (
        <div style={{ color: '#83552d' }}>No borrow history found.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#83552d', color: '#fff' }}>
              <th style={{ padding: '0.75rem' }}>#</th>
              <th style={{ padding: '0.75rem' }}>Borrow Date</th>
              <th style={{ padding: '0.75rem' }}>Return Date</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
              <th style={{ padding: '0.75rem' }}>Books</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr key={item._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>{idx + 1}</td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>{item.borrowDate ? new Date(item.borrowDate).toLocaleDateString() : '-'}</td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>{item.returnDate ? new Date(item.returnDate).toLocaleDateString() : '-'}</td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>{item.status || '-'}</td>
                <td style={{ padding: '0.75rem' }}>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {(item.books || []).map(book => (
                      <li key={book._id} style={{ color: '#543512' }}>{book.title}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BorrowHistoryPage; 