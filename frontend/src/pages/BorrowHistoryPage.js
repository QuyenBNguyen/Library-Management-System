import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BorrowHistoryDetail from '../components/BorrowHistoryDetail';
import BorrowBookModal from '../components/BorrowBookModal';
import '../styles/dashboard.css';

const BorrowHistoryPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('borrowed');
  const [overdueSessions, setOverdueSessions] = useState([]);
  const [overdueLoading, setOverdueLoading] = useState(false);
  const [overdueError, setOverdueError] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/borrow/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setSessions(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch borrow history.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOverdue = async () => {
    setOverdueLoading(true);
    setOverdueError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/borrow/history?overdue=true', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setOverdueSessions(response.data.data || []);
    } catch (err) {
      setOverdueError('Failed to fetch overdue borrowers.');
    } finally {
      setOverdueLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    if (activeTab === 'overdue') fetchOverdue();
  }, [activeTab]);

  const filteredSessions = sessions
    .filter(({ session, books }) => {
      // Exclude sessions with any overdue book
      return !books.some(b => b.overdueDay > 0);
    })
    .filter(({ session }) => {
      if (!search) return true;
      return (
        session._id?.toLowerCase().includes(search.toLowerCase()) ||
        session.member?.name?.toLowerCase().includes(search.toLowerCase())
      );
    });

  const handleCheckoutSuccess = () => {
    setShowBorrowModal(false);
    fetchHistory();
  };

  const handleReturnSuccess = () => {
    setSelectedSession(null);
    fetchHistory();
  };

  const handleReturnSession = async (books) => {
    const unreturned = books.filter(b => !b.returnDate).map(b => b._id);
    if (unreturned.length === 0) return;
    if (!window.confirm('Return all unreturned books in this session?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/borrow/return', {
        borrowBookIds: unreturned
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      fetchHistory();
    } catch (err) {
      alert('Failed to return books.');
    }
  };

  const handlePayFine = async (session, books) => {
    const token = localStorage.getItem('token');
    // Collect all unreturned overdue borrowBook IDs for this session
    const overdueBookIds = books.filter(b => !b.returnDate && b.fineAmount > 0).map(b => b._id);
    const amount = books.reduce((sum, b) => sum + (b.fineAmount || 0), 0);

    if (overdueBookIds.length === 0 || amount === 0) {
      alert('No fine to pay.');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/payment',
        {
          borrowBookIds: overdueBookIds,
          amount: amount,
          method: 'vnpay'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (res.data.url) {
        window.location.href = res.data.url; // Redirect to VNPay
      } else {
        alert('Failed to get payment URL.');
      }
    } catch (err) {
      alert('Failed to initiate payment.');
    }
  };

  return (
    <div className="content-container">
      <div className="user-table-card">
        <div className="user-table-header-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 0 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <button
              className={activeTab === 'borrowed' ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ borderRadius: 8, minWidth: 140, fontWeight: 600 }}
              onClick={() => setActiveTab('borrowed')}
            >
              Borrowed Books
            </button>
            <button
              className={activeTab === 'overdue' ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ borderRadius: 8, minWidth: 140, fontWeight: 600 }}
              onClick={() => setActiveTab('overdue')}
            >
              Overdue Borrowers
            </button>
          </div>
          {activeTab === 'borrowed' && (
            <div className="user-table-header-actions" style={{ marginTop: 0 }}>
              <button className="add-user-btn" onClick={() => setShowBorrowModal(true)}>
                <span className="material-icons">add_circle</span>
                Checkout Books
              </button>
              <div className="search-bar">
                <span className="material-icons">search</span>
                <input
                  type="text"
                  placeholder="Search by ID"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        {activeTab === 'borrowed' ? (
          <div className="user-table-scroll">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Borrower</th>
                  <th>Number of Books</th>
                  <th>Due Date</th>
                  <th>Overdue Days</th>
                  <th>Fine</th>
                  <th>Checkout Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="8">Loading...</td></tr>
                ) : error ? (
                  <tr><td colSpan="8" style={{ color: '#d32f2f' }}>{error}</td></tr>
                ) : filteredSessions.length === 0 ? (
                  <tr><td colSpan="8">No borrow history found.</td></tr>
                ) : (
                  filteredSessions.map(({ session, books }) => {
                    const hasUnreturned = books.some(b => !b.returnDate);
                    const maxOverdue = Math.max(...books.map(b => b.overdueDay || 0));
                    const totalFine = books.reduce((sum, b) => sum + (b.fineAmount || 0), 0);
                    return (
                      <tr key={session._id} style={{ cursor: 'pointer' }} onClick={() => setSelectedSession({ session, books })}>
                        <td>{session._id?.slice(-3) || '-'}</td>
                        <td>{session.member?.name || '-'}</td>
                        <td>{books.length} Books</td>
                        <td>{session.dueDate ? new Date(session.dueDate).toLocaleDateString('en-GB') : '-'}</td>
                        <td style={maxOverdue > 0 ? { color: '#ff416c', fontWeight: 700 } : {}}>{maxOverdue > 0 ? maxOverdue : '-'}</td>
                        <td style={totalFine > 0 ? { color: '#ff416c', fontWeight: 700 } : {}}>{totalFine > 0 ? `$${totalFine}` : '-'}</td>
                        <td>{session.borrowDate ? new Date(session.borrowDate).toLocaleDateString('en-GB') + ' ' + new Date(session.borrowDate).toLocaleTimeString('en-GB', { hour12: false }) : '-'}</td>
                        <td style={{ display: 'flex', gap: 8 }}>
                          {hasUnreturned ? (
                            <button
                              className="btn-action btn-view"
                              title="Return all"
                              style={{
                                padding: '0 18px',
                                fontSize: 15,
                                minWidth: 72,
                                height: 36,
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                whiteSpace: 'nowrap',
                                lineHeight: '1'
                              }}
                              onClick={e => { e.stopPropagation(); handleReturnSession(books); }}
                            >
                              Return
                            </button>
                          ) : (
                            <span style={{ color: '#aaa' }}>All returned</span>
                          )}
                          {totalFine > 0 && (
                            <button
                              className="btn-action btn-edit"
                              title="Pay Fine"
                              style={{
                                padding: '0 18px',
                                fontSize: 15,
                                minWidth: 72,
                                height: 36,
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                whiteSpace: 'nowrap',
                                lineHeight: '1'
                              }}
                              onClick={e => { e.stopPropagation(); handlePayFine(session, books); }}
                            >
                              Pay Fine
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="user-table-scroll">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Borrower</th>
                  <th>Number of Books</th>
                  <th>Due Date</th>
                  <th>Overdue Days</th>
                  <th>Fine</th>
                  <th>Checkout Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {overdueLoading ? (
                  <tr><td colSpan="8">Loading...</td></tr>
                ) : overdueError ? (
                  <tr><td colSpan="8" style={{ color: '#d32f2f' }}>{overdueError}</td></tr>
                ) : overdueSessions.length === 0 ? (
                  <tr><td colSpan="8">No overdue borrowers found.</td></tr>
                ) : (
                  overdueSessions.map(({ session, books }) => {
                    const hasUnreturned = books.some(b => !b.returnDate);
                    const maxOverdue = Math.max(...books.map(b => b.overdueDay || 0));
                    const totalFine = books.reduce((sum, b) => sum + (b.fineAmount || 0), 0);
                    return (
                      <tr key={session._id} style={{ cursor: 'pointer' }} onClick={() => setSelectedSession({ session, books })}>
                        <td>{session._id?.slice(-3) || '-'}</td>
                        <td>{session.member?.name || '-'}</td>
                        <td>{books.length} Books</td>
                        <td>{session.dueDate ? new Date(session.dueDate).toLocaleDateString('en-GB') : '-'}</td>
                        <td style={maxOverdue > 0 ? { color: '#ff416c', fontWeight: 700 } : {}}>{maxOverdue > 0 ? maxOverdue : '-'}</td>
                        <td style={totalFine > 0 ? { color: '#ff416c', fontWeight: 700 } : {}}>{totalFine > 0 ? `$${totalFine}` : '-'}</td>
                        <td>{session.borrowDate ? new Date(session.borrowDate).toLocaleDateString('en-GB') + ' ' + new Date(session.borrowDate).toLocaleTimeString('en-GB', { hour12: false }) : '-'}</td>
                        <td style={{ display: 'flex', gap: 8 }}>
                          {hasUnreturned ? (
                            <button
                              className="btn-action btn-view"
                              title="Return all"
                              style={{
                                padding: '0 18px',
                                fontSize: 15,
                                minWidth: 72,
                                height: 36,
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                whiteSpace: 'nowrap',
                                lineHeight: '1'
                              }}
                              onClick={e => { e.stopPropagation(); handleReturnSession(books); }}
                            >
                              Return
                            </button>
                          ) : (
                            <span style={{ color: '#aaa' }}>All returned</span>
                          )}
                          {totalFine > 0 && (
                            <button
                              className="btn-action btn-edit"
                              title="Pay Fine"
                              style={{
                                padding: '0 18px',
                                fontSize: 15,
                                minWidth: 72,
                                height: 36,
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                whiteSpace: 'nowrap',
                                lineHeight: '1'
                              }}
                              onClick={e => { e.stopPropagation(); handlePayFine(session, books); }}
                            >
                              Pay Fine
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showBorrowModal && (
        <BorrowBookModal
          isOpen={showBorrowModal}
          onClose={() => setShowBorrowModal(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
      {selectedSession && (
        <BorrowHistoryDetail
          borrowSession={selectedSession.session}
          books={selectedSession.books}
          onClose={() => setSelectedSession(null)}
          onReturn={handleReturnSuccess}
        />
      )}
    </div>
  );
};

export default BorrowHistoryPage; 