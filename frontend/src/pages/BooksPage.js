import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardHeader from "../components/DashboardHeader";
import DashboardSidebar from "../components/DashboardSidebar";
import BorrowBookModal from "../components/BorrowBookModal";
import "../styles/dashboard.css";

const BooksPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [userRole, setUserRole] = useState('member');

  const API_BASE_URL = "http://localhost:5000";

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Get user info from localStorage
  const getUserInfo = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : {};
  };

  // Fetch books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();
      
      if (!token) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      const userInfo = getUserInfo();
      setUserRole(userInfo.role || 'member');

      const response = await axios.get(`${API_BASE_URL}/books`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        setBooks(response.data);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      if (error.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        localStorage.removeItem('token');
      } else {
        setError(error.response?.data?.error || "Failed to fetch books");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    let className = 'status-badge ';
    let text = status;

    switch (status) {
      case 'available':
        className += 'success';
        text = 'Available';
        break;
      case 'checked out':
        className += 'warning';
        text = 'Checked Out';
        break;
      case 'lost':
        className += 'error';
        text = 'Lost';
        break;
      case 'damaged':
        className += 'error';
        text = 'Damaged';
        break;
      case 'maintenance':
        className += 'warning';
        text = 'Maintenance';
        break;
      default:
        className += 'info';
    }

    return <span className={className}>{text}</span>;
  };

  const handleBorrowSuccess = () => {
    // Refresh the books list after successful borrow
    fetchBooks();
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.ISBN.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || book.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="admin-dashboard">
        <DashboardSidebar active="Books" onLogout={handleLogout} />
        <div className="main-content">
          <DashboardHeader username="User" role={userRole} />
          <div className="content-container">
            <div className="loading" style={{
              textAlign: 'center',
              padding: '50px',
              fontSize: '18px',
              color: '#666'
            }}>
              Loading books...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <DashboardSidebar active="Books" onLogout={handleLogout} />
      <div className="main-content">
        <DashboardHeader username="User" role={userRole} />

        <div className="content-container">
          <div className="content-header">
            <h1 className="page-title">Books Catalog</h1>
            <div className="content-actions">
              {userRole === 'member' && (
                <button 
                  className="add-user-btn"
                  onClick={() => setShowBorrowModal(true)}
                >
                  <span className="material-icons">library_books</span>
                  Borrow Books
                </button>
              )}
              <div className="search-bar">
                <span className="material-icons">search</span>
                <input 
                  type="text" 
                  placeholder="Search by title, author, or ISBN..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="checked out">Checked Out</option>
                <option value="lost">Lost</option>
                <option value="damaged">Damaged</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {error && (
            <div style={{ 
              padding: '15px', 
              marginBottom: '20px', 
              backgroundColor: '#ffebee', 
              color: '#c62828', 
              borderRadius: '5px',
              border: '1px solid #ffcdd2'
            }}>
              {error}
            </div>
          )}

          {/* Books Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '20px',
            marginTop: '20px'
          }}>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <div key={book._id} style={{ 
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  padding: '20px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '15px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        margin: '0 0 10px 0', 
                        color: '#333',
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}>
                        {book.title}
                      </h3>
                      <p style={{ 
                        margin: '0 0 5px 0', 
                        color: '#666',
                        fontSize: '14px'
                      }}>
                        <strong>Author:</strong> {book.author}
                      </p>
                      <p style={{ 
                        margin: '0 0 5px 0', 
                        color: '#666',
                        fontSize: '14px'
                      }}>
                        <strong>ISBN:</strong> {book.ISBN}
                      </p>
                      {book.genre && (
                        <p style={{ 
                          margin: '0 0 5px 0', 
                          color: '#666',
                          fontSize: '14px'
                        }}>
                          <strong>Genre:</strong> {book.genre}
                        </p>
                      )}
                      {book.publisher && (
                        <p style={{ 
                          margin: '0 0 5px 0', 
                          color: '#666',
                          fontSize: '14px'
                        }}>
                          <strong>Publisher:</strong> {book.publisher}
                        </p>
                      )}
                      {book.publishedDate && (
                        <p style={{ 
                          margin: '0 0 5px 0', 
                          color: '#666',
                          fontSize: '14px'
                        }}>
                          <strong>Published:</strong> {formatDate(book.publishedDate)}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {getStatusBadge(book.status)}
                    </div>
                  </div>

                  {userRole === 'member' && book.status === 'available' && (
                    <button
                      style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginTop: '10px'
                      }}
                      onClick={() => setShowBorrowModal(true)}
                    >
                      <span className="material-icons" style={{ fontSize: '16px', marginRight: '5px' }}>
                        library_books
                      </span>
                      Borrow This Book
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div style={{ 
                gridColumn: '1 / -1',
                textAlign: 'center', 
                padding: '40px', 
                color: '#666' 
              }}>
                No books found matching your criteria.
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div style={{ 
            marginTop: '30px', 
            display: 'flex', 
            gap: '20px', 
            flexWrap: 'wrap' 
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              padding: '20px', 
              borderRadius: '10px', 
              color: 'white',
              minWidth: '200px'
            }}>
              <h3>Total Books</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {books.length}
              </p>
            </div>
            <div style={{ 
              background: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)', 
              padding: '20px', 
              borderRadius: '10px', 
              color: 'white',
              minWidth: '200px'
            }}>
              <h3>Available</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {books.filter(book => book.status === 'available').length}
              </p>
            </div>
            <div style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
              padding: '20px', 
              borderRadius: '10px', 
              color: 'white',
              minWidth: '200px'
            }}>
              <h3>Checked Out</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {books.filter(book => book.status === 'checked out').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Borrow Modal */}
      <BorrowBookModal
        isOpen={showBorrowModal}
        onClose={() => setShowBorrowModal(false)}
        onSuccess={handleBorrowSuccess}
      />
    </div>
  );
};

export default BooksPage; 