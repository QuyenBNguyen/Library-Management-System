import React, { useEffect, useState } from 'react';
import loanApi from '../api/loanApi';

const styles = {
  wrapper: { maxWidth: 900, margin: '2rem auto', background: '#f5e6c9', borderRadius: 16, padding: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
  title: { fontSize: '2rem', fontWeight: 700, color: '#543512', marginBottom: '2rem', textAlign: 'center' },
  reservedCount: { color: '#ffae00', background: 'rgba(255, 174, 0, 0.15)', fontWeight: 600, borderRadius: 8, padding: '0.4rem 1.2rem', display: 'inline-block', marginBottom: '1.5rem', fontSize: '1.1rem' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden' },
  th: { background: '#83552d', color: '#f5e6c9', padding: '1rem', fontWeight: 600, fontSize: '1rem', borderBottom: '2px solid #543512' },
  td: { padding: '0.8rem 1rem', borderBottom: '1px solid #e1bb80', color: '#543512', fontSize: '1rem', textAlign: 'center' },
  status: { fontWeight: 600, borderRadius: 8, padding: '0.3rem 1rem', display: 'inline-block' },
  statusBorrowed: { background: 'rgba(255, 174, 0, 0.15)', color: '#ffae00' },
  statusReturned: { background: 'rgba(92, 184, 92, 0.15)', color: '#5cb85c' },
  statusOverdue: { background: 'rgba(217, 83, 79, 0.15)', color: '#d9534f' },
  statusReserved: { background: 'rgba(255, 174, 0, 0.25)', color: '#ffae00' },
};

const getStatusStyle = (status) => {
  if (status === 'borrowed') return { ...styles.status, ...styles.statusBorrowed };
  if (status === 'returned') return { ...styles.status, ...styles.statusReturned };
  if (status === 'overdue') return { ...styles.status, ...styles.statusOverdue };
  if (status === 'reserved') return { ...styles.status, ...styles.statusReserved };
  return styles.status;
};

const BorrowListPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await loanApi.getAll();
        setLoans(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        setError('Failed to fetch your borrow list.');
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const reservedCount = loans.filter(l => l.status === 'reserved').length;

  return (
    <div style={styles.wrapper}>
      <div style={styles.title}>My Borrowed Books</div>
      <div style={styles.reservedCount}>
        Reserved Books: {reservedCount}
      </div>
      {loading ? (
        <div style={{ color: '#543512', textAlign: 'center', margin: '2rem' }}>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', margin: '2rem' }}>{error}</div>
      ) : loans.length === 0 ? (
        <div style={{ color: '#543512', textAlign: 'center', margin: '2rem' }}>You have no borrowed books.</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Book</th>
              <th style={styles.th}>Checkout Date</th>
              <th style={styles.th}>Due Date</th>
              <th style={styles.th}>Return Date</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id}>
                <td style={styles.td}>{loan.book?.title || '-'}</td>
                <td style={styles.td}>{loan.borrowDate ? new Date(loan.borrowDate).toLocaleDateString() : '-'}</td>
                <td style={styles.td}>{loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : '-'}</td>
                <td style={styles.td}>{loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : (loan.status === 'reserved' ? '-' : '')}</td>
                <td style={getStatusStyle(loan.status)}>{loan.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BorrowListPage; 