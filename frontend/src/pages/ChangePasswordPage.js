import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [authInfo, setAuthInfo] = useState(null);

  // Kiểm tra authentication khi component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          setAuthInfo({
            hasToken: true,
            tokenLength: token.length,
            payload: payload,
            expiresAt: new Date(payload.exp * 1000),
            isExpired: Date.now() > payload.exp * 1000
          });
        }
      } catch (error) {
        setAuthInfo({
          hasToken: true,
          tokenLength: token.length,
          error: 'Cannot decode token'
        });
      }
    } else {
      setAuthInfo({
        hasToken: false,
        message: 'No token found'
      });
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear messages when user starts typing
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.currentPassword.trim()) {
      setError('Current password is required');
      return false;
    }

    if (!formData.newPassword.trim()) {
      setError('New password is required');
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password do not match');
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return false;
    }

    return true;
  };

  const testAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please login first.');
      return;
    }

    try {
      console.log('Testing authentication...');
      const response = await axios.get('http://localhost:5000/member/test-auth', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Auth test response:', response.data);
      setSuccess('Authentication test successful!');
    } catch (error) {
      console.error('Auth test failed:', error);
      setError(`Auth test failed: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You are not logged in. Please login again.');
        setLoading(false);
        return;
      }

      // Debug: Log token để kiểm tra
      console.log('Token from localStorage:', token);
      console.log('Token length:', token.length);
      
      // Debug: Decode token để xem nội dung (chỉ để debug)
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Token payload:', payload);
        }
      } catch (decodeError) {
        console.log('Cannot decode token:', decodeError);
      }

      console.log('Sending change password request...');
      console.log('Request URL:', 'http://localhost:5000/member/change-password');
      console.log('Request body:', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      console.log('Request headers:', {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      const response = await axios.put(
        'http://localhost:5000/member/change-password',
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Change password response:', response.data);

      if (response.data.success) {
        setSuccess('Password changed successfully!');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(response.data.error || 'Failed to change password');
      }
    } catch (err) {
      console.error('Change password error:', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      if (err.response?.status === 401) {
        setError('Your session has expired. Please login again.');
        // Redirect to login page
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (err.response?.status === 403) {
        setError('Access denied. Please check your authentication.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message === 'Network Error') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Failed to change password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #543512 0%, #83552d 100%)',
      padding: '2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    card: {
      backgroundColor: '#f5e6c9',
      borderRadius: '16px',
      padding: '3rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      maxWidth: '500px',
      width: '100%',
      border: '2px solid #83552d'
    },
    title: {
      color: '#543512',
      fontSize: '2rem',
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: '2rem',
      fontFamily: "'Poppins', sans-serif"
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    label: {
      color: '#543512',
      fontSize: '1rem',
      fontWeight: '600',
      fontFamily: "'Poppins', sans-serif"
    },
    input: {
      padding: '0.75rem 1rem',
      border: '2px solid #83552d',
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: '#fff',
      color: '#543512',
      fontFamily: "'Poppins', sans-serif",
      transition: 'border-color 0.2s, box-shadow 0.2s'
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#ffae00',
      boxShadow: '0 0 0 3px rgba(255, 174, 0, 0.1)'
    },
    button: {
      backgroundColor: '#ffae00',
      color: '#543512',
      border: 'none',
      borderRadius: '8px',
      padding: '1rem',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      fontFamily: "'Poppins', sans-serif",
      transition: 'all 0.2s',
      marginTop: '1rem'
    },
    buttonHover: {
      backgroundColor: '#e69c00',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(255, 174, 0, 0.3)'
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
      transform: 'none'
    },
    error: {
      color: '#d32f2f',
      backgroundColor: '#ffebee',
      padding: '0.75rem',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontFamily: "'Poppins', sans-serif",
      border: '1px solid #ffcdd2'
    },
    success: {
      color: '#2e7d32',
      backgroundColor: '#e8f5e8',
      padding: '0.75rem',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontFamily: "'Poppins', sans-serif",
      border: '1px solid #c8e6c9'
    },
    backLink: {
      display: 'block',
      textAlign: 'center',
      marginTop: '1.5rem',
      color: '#83552d',
      textDecoration: 'none',
      fontSize: '1rem',
      fontFamily: "'Poppins', sans-serif",
      fontWeight: '500',
      transition: 'color 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Change Password</h1>
        
        {/* Đã xóa phần Authentication Status */}
        
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="currentPassword">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              style={styles.input}
              required
              placeholder="Enter your current password"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="newPassword">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              style={styles.input}
              required
              placeholder="Enter your new password"
              minLength="6"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              style={styles.input}
              required
              placeholder="Confirm your new password"
              minLength="6"
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#e69c00';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(255, 174, 0, 0.3)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#ffae00';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>

        <a href="/profile" style={styles.backLink}>
          ← Back to Profile
        </a>
      </div>
    </div>
  );
};

export default ChangePasswordPage; 