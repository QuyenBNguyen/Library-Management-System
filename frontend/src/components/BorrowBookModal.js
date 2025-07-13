import React, { useState, useEffect } from "react";
import axios from "axios";

const BorrowBookModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [dueDate, setDueDate] = useState("");

  const API_BASE_URL = "http://localhost:5000";

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch available books
  const fetchAvailableBooks = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) return;

      const response = await axios.get(`${API_BASE_URL}/books`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        const available = response.data.filter(book => book.status === 'available');
        setAvailableBooks(available);
      }
    } catch (error) {
      console.error("Error fetching available books:", error);
    }
  };

  // Load available books when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailableBooks();
      setSelectedBooks([]);
      setDueDate("");
      setError(null);
    }
  }, [isOpen]);

  // Set default due date (2 weeks from now)
  useEffect(() => {
    if (isOpen && !dueDate) {
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 14);
      setDueDate(defaultDueDate.toISOString().split('T')[0]);
    }
  }, [isOpen, dueDate]);

  const handleBookSelection = (bookId) => {
    setSelectedBooks(prev => {
      if (prev.includes(bookId)) {
        return prev.filter(id => id !== bookId);
      } else {
        return [...prev, bookId];
      }
    });
  };

  const handleBorrow = async () => {
    if (selectedBooks.length === 0) {
      setError("Please select at least one book to borrow");
      return;
    }

    if (!dueDate) {
      setError("Please select a due date");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      
      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/borrow/borrow`, {
        bookIds: selectedBooks,
        dueDate: dueDate
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        onSuccess(response.data.data);
        onClose();
        
        // Show success notification
        const successNotification = document.createElement('div');
        successNotification.className = 'notification success';
        successNotification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          animation: slideInRight 0.3s ease-out;
        `;
        successNotification.innerHTML = `
          <span class="material-icons">check_circle</span>
          Books borrowed successfully!
        `;
        document.body.appendChild(successNotification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
          if (successNotification.parentNode) {
            successNotification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
              if (successNotification.parentNode) {
                successNotification.parentNode.removeChild(successNotification);
              }
            }, 300);
          }
        }, 3000);
      }
    } catch (error) {
      console.error("Error borrowing books:", error);
      setError(error.response?.data?.error || "Failed to borrow books");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="material-icons">library_books</span>
            Borrow Books
          </div>
          <button className="modal-close" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div style={{ 
              padding: '10px', 
              marginBottom: '15px', 
              backgroundColor: '#ffebee', 
              color: '#c62828',
              borderRadius: '5px',
              border: '1px solid #ffcdd2'
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Due Date:</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="form-control"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label>Select Books to Borrow:</label>
            <div style={{ 
              maxHeight: '300px', 
              overflowY: 'auto',
              border: '1px solid #ddd',
              borderRadius: '5px',
              padding: '10px'
            }}>
              {availableBooks.length > 0 ? (
                availableBooks.map((book) => (
                  <div key={book._id} style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    padding: '10px',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleBookSelection(book._id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBooks.includes(book._id)}
                      onChange={() => handleBookSelection(book._id)}
                      style={{ marginRight: '10px' }}
                    />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{book.title}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {book.author} • {book.ISBN}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  No available books found.
                </div>
              )}
            </div>
          </div>

          {selectedBooks.length > 0 && (
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#e8f5e8', 
              borderRadius: '5px',
              marginTop: '10px'
            }}>
              <strong>Selected Books ({selectedBooks.length}):</strong>
              <ul style={{ margin: '5px 0 0 20px' }}>
                {selectedBooks.map(bookId => {
                  const book = availableBooks.find(b => b._id === bookId);
                  return book ? (
                    <li key={bookId}>{book.title} by {book.author}</li>
                  ) : null;
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleBorrow}
            disabled={loading || selectedBooks.length === 0}
          >
            {loading ? "Borrowing..." : "Borrow Books"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BorrowBookModal; 