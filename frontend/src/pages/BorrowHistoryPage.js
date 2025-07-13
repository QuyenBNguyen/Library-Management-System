import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardHeader from "../components/DashboardHeader";
import DashboardSidebar from "../components/DashboardSidebar";
import "../styles/dashboard.css";

const BorrowHistoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [currentBorrows, setCurrentBorrows] = useState([]);
  const [activeTab, setActiveTab] = useState('history');
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userRole, setUserRole] = useState('member');

  // API base URL
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

  // Fetch borrow history
  const fetchBorrowHistory = async () => {
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

      let endpoint = '/borrow-history/my-history';
      if (userInfo.role === 'librarian' || userInfo.role === 'manager') {
        endpoint = `/borrow-history/all?page=${currentPage}&limit=10`;
        if (searchTerm) {
          endpoint += `&search=${encodeURIComponent(searchTerm)}`;
        }
      }

      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        if (userInfo.role === 'librarian' || userInfo.role === 'manager') {
          setBorrowHistory(response.data.data);
          setTotalPages(response.data.pagination?.totalPages || 1);
        } else {
          setBorrowHistory(response.data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching borrow history:", error);
      if (error.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        localStorage.removeItem('token');
      } else {
        setError(error.response?.data?.error || "Failed to fetch borrow history");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch current borrows
  const fetchCurrentBorrows = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) return;

      const response = await axios.get(`${API_BASE_URL}/borrow-history/current`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setCurrentBorrows(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching current borrows:", error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchBorrowHistory();
    fetchCurrentBorrows();
  }, [currentPage, searchTerm]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

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

  const renderHistoryTable = () => {
    if (userRole === 'librarian' || userRole === 'manager') {
      return (
        <table className="data-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Book</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Return Date</th>
              <th>Fine</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {borrowHistory.length > 0 ? (
              borrowHistory.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{item.memberName}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{item.memberEmail}</div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{item.bookTitle}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {item.bookAuthor} • {item.ISBN}
                      </div>
                    </div>
                  </td>
                  <td>{formatDate(item.borrowDate)}</td>
                  <td>{formatDate(item.dueDate)}</td>
                  <td>{item.returnDate ? formatDate(item.returnDate) : '-'}</td>
                  <td>
                    {item.fineAmount > 0 ? (
                      <span style={{ color: '#ff416c', fontWeight: 'bold' }}>
                        ${item.fineAmount.toFixed(2)}
                      </span>
                    ) : '-'}
                  </td>
                  <td>{getStatusBadge(item.status, item.isOverdue)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  No borrow history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      );
    } else {
      return (
        <div>
          {borrowHistory.map((session) => (
            <div key={session.sessionId} style={{ 
              marginBottom: '20px', 
              padding: '15px', 
              border: '1px solid #ddd', 
              borderRadius: '8px',
              backgroundColor: '#fff'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '10px',
                paddingBottom: '10px',
                borderBottom: '1px solid #eee'
              }}>
                <div>
                  <strong>Borrow Date:</strong> {formatDateTime(session.borrowDate)}
                </div>
                <div>
                  <strong>Due Date:</strong> {formatDate(session.dueDate)}
                </div>
                <div>
                  {session.isOverdue && (
                    <span style={{ 
                      color: '#ff416c', 
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      ⚠️ Overdue
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                {session.books.map((book) => (
                  <div key={book.bookId} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '10px',
                    margin: '5px 0',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '5px'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{book.title}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {book.author} • {book.ISBN}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div>{getStatusBadge(book.status, session.isOverdue)}</div>
                      {book.returnDate && (
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          Returned: {formatDate(book.returnDate)}
                        </div>
                      )}
                      {book.fineAmount > 0 && (
                        <div style={{ fontSize: '12px', color: '#ff416c' }}>
                          Fine: ${book.fineAmount.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  const renderCurrentBorrows = () => {
    return (
      <div>
        {currentBorrows.map((session) => (
          <div key={session.sessionId} style={{ 
            marginBottom: '20px', 
            padding: '15px', 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            backgroundColor: '#fff'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '10px',
              paddingBottom: '10px',
              borderBottom: '1px solid #eee'
            }}>
              <div>
                <strong>Borrow Date:</strong> {formatDateTime(session.borrowDate)}
              </div>
              <div>
                <strong>Due Date:</strong> {formatDate(session.dueDate)}
              </div>
              <div>
                {session.isOverdue && (
                  <span style={{ 
                    color: '#ff416c', 
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    ⚠️ {session.overdueDays} days overdue
                  </span>
                )}
              </div>
            </div>
            
            <div>
              {session.books.map((book) => (
                <div key={book.bookId} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '5px'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{book.title}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {book.author} • {book.ISBN}
                    </div>
                  </div>
                  <div>
                    <span className="status-badge warning">Currently Borrowed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {currentBorrows.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No current borrows found.
          </div>
        )}
      </div>
    );
  };

  const renderPagination = () => {
    if (userRole !== 'librarian' && userRole !== 'manager') return null;

    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: '20px',
        gap: '10px'
      }}>
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="btn btn-secondary"
          style={{ padding: '8px 16px' }}
        >
          Previous
        </button>
        
        <span style={{ padding: '8px 16px' }}>
          Page {currentPage} of {totalPages}
        </span>
        
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="btn btn-secondary"
          style={{ padding: '8px 16px' }}
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <DashboardSidebar active="Borrow History" onLogout={handleLogout} />
        <div className="main-content">
          <DashboardHeader username="User" role={userRole} />
          <div className="content-container">
            <div className="loading" style={{
              textAlign: 'center',
              padding: '50px',
              fontSize: '18px',
              color: '#666'
            }}>
              Loading borrow history...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <DashboardSidebar active="Borrow History" onLogout={handleLogout} />
      <div className="main-content">
        <DashboardHeader username="User" role={userRole} />

        <div className="content-container">
          <div className="content-header">
            <h1 className="page-title">Borrow History</h1>
            <div className="content-actions">
              {(userRole === 'librarian' || userRole === 'manager') && (
                <div className="search-bar">
                  <span className="material-icons">search</span>
                  <input 
                    type="text" 
                    placeholder="Search by member name..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              )}
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

          {/* Tab Navigation */}
          <div style={{ 
            display: 'flex', 
            marginBottom: '20px',
            borderBottom: '1px solid #ddd'
          }}>
            <button
              onClick={() => setActiveTab('history')}
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: activeTab === 'history' ? '#667eea' : 'transparent',
                color: activeTab === 'history' ? 'white' : '#666',
                cursor: 'pointer',
                borderBottom: activeTab === 'history' ? '2px solid #667eea' : 'none'
              }}
            >
              Borrow History
            </button>
            <button
              onClick={() => setActiveTab('current')}
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: activeTab === 'current' ? '#667eea' : 'transparent',
                color: activeTab === 'current' ? 'white' : '#666',
                cursor: 'pointer',
                borderBottom: activeTab === 'current' ? '2px solid #667eea' : 'none'
              }}
            >
              Current Borrows
            </button>
          </div>

          {/* Content */}
          <div className="data-table-container">
            {activeTab === 'history' ? renderHistoryTable() : renderCurrentBorrows()}
          </div>

          {/* Pagination */}
          {activeTab === 'history' && renderPagination()}

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
              <h3>Total Borrows</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {borrowHistory.length}
              </p>
            </div>
            <div style={{ 
              background: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)', 
              padding: '20px', 
              borderRadius: '10px', 
              color: 'white',
              minWidth: '200px'
            }}>
              <h3>Current Borrows</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {currentBorrows.length}
              </p>
            </div>
            <div style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
              padding: '20px', 
              borderRadius: '10px', 
              color: 'white',
              minWidth: '200px'
            }}>
              <h3>Overdue Items</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {currentBorrows.filter(session => session.isOverdue).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowHistoryPage; 