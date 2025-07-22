import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BorrowSessionDetailPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [returning, setReturning] = useState(null); // borrowBookId being returned

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const fetchSession = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/borrow/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Find the session by sessionId
      const found = (res.data.data || []).find(({ session }) => session._id === sessionId);
      if (!found) {
        setError("Session not found");
        setSession(null);
        setBooks([]);
      } else {
        setSession(found.session);
        setBooks(found.books);
      }
    } catch (err) {
      setError("Failed to fetch session details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
    // eslint-disable-next-line
  }, [sessionId]);

  const handleReturn = async (borrowBookId) => {
    setReturning(borrowBookId);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/borrow/return', {
        borrowBookIds: [borrowBookId]
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      await fetchSession();
    } catch (err) {
      alert('Failed to return book.');
    } finally {
      setReturning(null);
    }
  };

  return (
    <div className="content-container">
      <div className="user-table-card" style={{ maxWidth: 800, margin: '32px auto', padding: 32 }}>
        <div className="user-table-header-row" style={{ justifyContent: 'space-between', alignItems: 'center', padding: 0, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              <span className="material-icons">arrow_back</span> Back
            </button>
            <h2 style={{ margin: 0, fontSize: 22 }}>Borrow Session Details</h2>
          </div>
          {session && (
            <div style={{ color: '#666', fontWeight: 500 }}>
              Borrower: <span style={{ color: '#222' }}>{session.member?.name || '-'}</span>
            </div>
          )}
        </div>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center' }}>Loading...</div>
        ) : error ? (
          <div style={{ padding: 32, color: '#d32f2f', textAlign: 'center' }}>{error}</div>
        ) : session ? (
          <>
            <div style={{ marginBottom: 18, display: 'flex', gap: 32 }}>
              <div>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Borrow Date:</label>
                <div>{formatDateTime(session.borrowDate)}</div>
              </div>
              <div>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Due Date:</label>
                <div>{formatDate(session.dueDate)}</div>
              </div>
            </div>
            <div style={{ marginBottom: 8, fontWeight: 500, color: '#333' }}>Books in this session:</div>
            <div style={{ overflowX: 'auto' }}>
              <table className="user-table" style={{ width: '100%', minWidth: 700, margin: 0 }}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
                    <th>Status</th>
                    <th>Return Date</th>
                    <th>Overdue Days</th>
                    <th>Fine</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {books.length === 0 ? (
                    <tr><td colSpan="8">No books in this session.</td></tr>
                  ) : (
                    books.map((bb) => (
                      <tr key={bb._id}>
                        <td>{bb.book?.title || '-'}</td>
                        <td>{bb.book?.author || '-'}</td>
                        <td>{bb.book?.ISBN || '-'}</td>
                        <td>{bb.returnDate ? 'Returned' : 'Borrowed'}</td>
                        <td>{bb.returnDate ? formatDate(bb.returnDate) : '-'}</td>
                        <td>{bb.overdueDay > 0 ? bb.overdueDay : '-'}</td>
                        <td>{bb.fineAmount > 0 ? bb.fineAmount.toLocaleString() : '-'}</td>
                        <td>
                          {!bb.returnDate && (
                            <button className="btn btn-primary" onClick={() => handleReturn(bb._id)} style={{ padding: '4px 10px', fontSize: 13 }} disabled={returning === bb._id}>
                              {returning === bb._id ? 'Returning...' : 'Return'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default BorrowSessionDetailPage; 