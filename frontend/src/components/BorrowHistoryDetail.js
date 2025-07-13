import React from "react";

const BorrowHistoryDetail = ({ borrowSession, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status, isOverdue = false) => {
    let className = 'status-badge ';
    let text = status;

    if (status === 'returned') {
      className += 'success';
    } else if (status === 'borrowed') {
      if (isOverdue) {
        className += 'error';
        text = 'Overdue';
      } else {
        className += 'warning';
      }
    }

    return <span className={className}>{text}</span>;
  };

  const calculateOverdueDays = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Borrow Date:</label>
                <div>{formatDateTime(borrowSession.borrowDate)}</div>
              </div>
              <div>
                <label style={{ fontWeight: 'bold', color: '#666' }}>Due Date:</label>
                <div>{formatDate(borrowSession.dueDate)}</div>
              </div>
            </div>

            {borrowSession.isOverdue && (
              <div style={{ 
                padding: '10px', 
                backgroundColor: '#ffebee', 
                color: '#c62828',
                borderRadius: '5px',
                marginBottom: '15px'
              }}>
                ⚠️ This session is overdue by {calculateOverdueDays(borrowSession.dueDate)} days
              </div>
            )}
          </div>

          <div>
            <h4 style={{ marginBottom: '15px', color: '#333' }}>Books in this session:</h4>
            {borrowSession.books.map((book, index) => (
              <div key={book.bookId} style={{ 
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px',
                backgroundColor: '#f8f9fa'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '10px'
                }}>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: '0 0 5px 0', color: '#333' }}>{book.title}</h5>
                    <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                      Author: {book.author}
                    </p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                      ISBN: {book.ISBN}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {getStatusBadge(book.status, borrowSession.isOverdue)}
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '10px',
                  fontSize: '14px'
                }}>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#666' }}>Status: </span>
                    {book.status === 'returned' ? 'Returned' : 'Currently Borrowed'}
                  </div>
                  {book.returnDate && (
                    <div>
                      <span style={{ fontWeight: 'bold', color: '#666' }}>Return Date: </span>
                      {formatDate(book.returnDate)}
                    </div>
                  )}
                  {book.overdueDay > 0 && (
                    <div>
                      <span style={{ fontWeight: 'bold', color: '#666' }}>Overdue Days: </span>
                      <span style={{ color: '#ff416c' }}>{book.overdueDay}</span>
                    </div>
                  )}
                  {book.fineAmount > 0 && (
                    <div>
                      <span style={{ fontWeight: 'bold', color: '#666' }}>Fine Amount: </span>
                      <span style={{ color: '#ff416c', fontWeight: 'bold' }}>
                        ${book.fineAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
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