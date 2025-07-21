import React, { useState, useEffect } from "react";
import axios from "axios";

const BorrowBookModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isbnInput, setIsbnInput] = useState("");
  const [foundBook, setFoundBook] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [memberResults, setMemberResults] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  const API_BASE_URL = "http://localhost:5000";

  const getAuthToken = () => localStorage.getItem('token');

  const normalizeIsbn = (isbn) => (isbn || '').replace(/[-\s]/g, '').toUpperCase();

  // Set default due date (2 weeks from now)
  useEffect(() => {
    if (isOpen && !dueDate) {
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 14);
      setDueDate(defaultDueDate.toISOString().split('T')[0]);
    }
    if (isOpen) {
      setIsbnInput("");
      setFoundBook(null);
      setSelectedBooks([]);
      setError(null);
      setMemberSearch("");
      setMemberResults([]);
      setSelectedMember(null);
    }
  }, [isOpen, dueDate]);

  const handleMemberSearch = async () => {
    setError(null);
    setMemberResults([]);
    setSelectedMember(null);
    if (!memberSearch.trim()) return;
    try {
      const token = getAuthToken();
      const res = await axios.get(`${API_BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { search: memberSearch.trim() }
      });
      setMemberResults(res.data.data || []);
      if ((res.data.data || []).length === 0) setError("No members found.");
    } catch (err) {
      setError("Failed to search for member.");
    }
  };

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setMemberResults([]);
    setMemberSearch(member.name);
    setError(null);
  };

  const handleIsbnSearch = async () => {
    setError(null);
    setFoundBook(null);
    if (!isbnInput.trim()) return;
    try {
      const token = getAuthToken();
      const res = await axios.get(`${API_BASE_URL}/api/books`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { search: isbnInput.trim() }
      });
      const books = res.data.data || [];
      // Find available book with normalized ISBN
      const inputNorm = normalizeIsbn(isbnInput);
      const book = books.find(b => normalizeIsbn(b.ISBN) === inputNorm && b.status === 'available');
      if (book) {
        setFoundBook(book);
      } else {
        setError("No available book found with this ISBN.");
      }
    } catch (err) {
      setError("Failed to search for book.");
    }
  };

  const handleAddBook = () => {
    if (foundBook && !selectedBooks.some(b => b._id === foundBook._id)) {
      setSelectedBooks([...selectedBooks, foundBook]);
      setFoundBook(null);
      setIsbnInput("");
      setError(null);
    }
  };

  const handleRemoveBook = (id) => {
    setSelectedBooks(selectedBooks.filter(b => b._id !== id));
  };

  const handleBorrow = async () => {
    if (!selectedMember) {
      setError("Please select a member to checkout for.");
      return;
    }
    if (selectedBooks.length === 0) {
      setError("Please add at least one book to borrow");
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
      const response = await axios.post(`${API_BASE_URL}/api/borrow/checkout`, {
        bookIds: selectedBooks.map(b => b._id),
        dueDate: dueDate,
        memberId: selectedMember._id
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
            <label>Member (search by name, email, or phone):</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                className="form-control"
                type="text"
                placeholder="Enter member name, email, or phone..."
                value={memberSearch}
                onChange={e => { setMemberSearch(e.target.value); setSelectedMember(null); }}
                onKeyDown={e => { if (e.key === 'Enter') handleMemberSearch(); }}
                disabled={loading}
                style={{ flex: 1 }}
              />
              <button className="btn btn-primary" type="button" onClick={handleMemberSearch} disabled={loading || !memberSearch.trim()} style={{ minWidth: 80 }}>
                Search
              </button>
            </div>
            {memberResults.length > 0 && (
              <div style={{ background: '#f5f5f5', borderRadius: 6, padding: 10, marginBottom: 8 }}>
                {memberResults.map(m => (
                  <div key={m._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 4, borderBottom: '1px solid #eee' }}>
                    <div>
                      <strong>{m.name}</strong> ({m.email}) {m.phone && <>- {m.phone}</>}
                    </div>
                    <button className="btn btn-secondary" type="button" onClick={() => handleSelectMember(m)} style={{ marginLeft: 12 }}>
                      Select
                    </button>
                  </div>
                ))}
              </div>
            )}
            {selectedMember && (
              <div style={{ background: '#e8f5e8', borderRadius: 6, padding: 10, marginBottom: 8 }}>
                Selected: <strong>{selectedMember.name}</strong> ({selectedMember.email}) {selectedMember.phone && <>- {selectedMember.phone}</>}
              </div>
            )}
          </div>
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
            <label>Search Book by ISBN:</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                className="form-control"
                type="text"
                placeholder="Enter ISBN..."
                value={isbnInput}
                onChange={e => setIsbnInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleIsbnSearch(); }}
                disabled={loading}
                style={{ flex: 1 }}
              />
              <button className="btn btn-primary" type="button" onClick={handleIsbnSearch} disabled={loading || !isbnInput.trim()} style={{ minWidth: 80 }}>
                Search
              </button>
            </div>
            {foundBook && (
              <div style={{ background: '#e8f5e8', borderRadius: 6, padding: 10, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <strong>{foundBook.title}</strong> by {foundBook.author} (ISBN: {foundBook.ISBN})
                </div>
                <button className="btn btn-secondary" type="button" onClick={handleAddBook} style={{ marginLeft: 12 }}>
                  Add
                </button>
              </div>
            )}
          </div>
          {selectedBooks.length > 0 && (
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#e8f5e8', 
              borderRadius: '5px',
              marginTop: '10px'
            }}>
              <strong>Books to Borrow ({selectedBooks.length}):</strong>
              <ul style={{ margin: '5px 0 0 20px' }}>
                {selectedBooks.map(book => (
                  <li key={book._id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {book.title} by {book.author} (ISBN: {book.ISBN})
                    <button
                      className="btn btn-secondary"
                      type="button"
                      style={{
                        padding: '0 18px',
                        fontSize: 15,
                        minWidth: 72,
                        marginLeft: 8,
                        whiteSpace: 'nowrap',
                        height: 36,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: '1'
                      }}
                      onClick={() => handleRemoveBook(book._id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
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
            disabled={loading || selectedBooks.length === 0 || !selectedMember}
          >
            {loading ? "Borrowing..." : "Borrow Books"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BorrowBookModal; 