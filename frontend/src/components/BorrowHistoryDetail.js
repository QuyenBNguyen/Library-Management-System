import React from "react";
import axios from "axios";

const BorrowHistoryDetail = ({ borrowSession, books = [], onClose, onReturn }) => {
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

  const handleReturn = async (borrowBookId) => {
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
      if (onReturn) onReturn();
    } catch (err) {
      alert('Failed to return book.');
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="material-icons">history</span>
            Borrow Session Details
          </div>
          <button className="modal-close" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: '20px', display: 'flex', gap: 32 }}>
            <div>
              <label style={{ fontWeight: 'bold', color: '#666' }}>Borrow Date:</label>
              <div>{formatDateTime(borrowSession.borrowDate)}</div>
            </div>
            <div>
              <label style={{ fontWeight: 'bold', color: '#666' }}>Due Date:</label>
              <div>{formatDate(borrowSession.dueDate)}</div>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '15px', color: '#333' }}>Books in this session:</h4>
            <table className="user-table">
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
                          <button className="btn btn-primary" onClick={() => handleReturn(bb._id)} style={{ padding: '4px 10px', fontSize: 13 }}>
                            Return
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BorrowHistoryDetail; 