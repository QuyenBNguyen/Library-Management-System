import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/dashboard.css";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    joinDate: "",
    address: "",
    avatar: "/images/avatar-placeholder.jpg",
    street: "",
    district: "",
    city: ""
  });

  const [formData, setFormData] = useState({ ...profileData });

  // API base URL - backend runs on port 3000
  const API_BASE_URL = "http://localhost:3000";

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch profile data from API
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();
      
      if (!token) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      console.log("Fetching profile with token:", token);

      const response = await axios.get(`${API_BASE_URL}/member/profile/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Profile response:", response.data);

      if (response.data.success) {
        const userData = response.data.data;
        const profileInfo = {
          id: userData._id || "",
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          role: userData.role || "",
          department: userData.department || "",
          joinDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "",
          address: `${userData.street || ""}, ${userData.district || ""}, ${userData.city || ""}`.trim(),
          avatar: "/images/avatar-placeholder.jpg",
          street: userData.street || "",
          district: userData.district || "",
          city: userData.city || ""
        };
        
        setProfileData(profileInfo);
        setFormData(profileInfo);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        localStorage.removeItem('token');
      } else if (error.response?.status === 404) {
        setError("Profile not found.");
      } else {
        setError(error.response?.data?.error || "Failed to fetch profile data");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ ...profileData });
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...profileData });
    setError(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();
      
      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      // Validation
      if (!formData.name.trim()) {
        setError("Name is required");
        return;
      }

      if (!formData.email.trim()) {
        setError("Email is required");
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address");
        return;
      }

      // Prepare update data
      const updateData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        street: formData.street.trim(),
        district: formData.district.trim(),
        city: formData.city.trim()
      };

      console.log("Updating profile with data:", updateData);

      const response = await axios.put(`${API_BASE_URL}/member/profile/me`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Update response:", response.data);

      if (response.data.success) {
        // Update the address display
        const updatedProfileData = {
          ...formData,
          address: `${formData.street}, ${formData.district}, ${formData.city}`.trim()
        };
        setProfileData(updatedProfileData);
        setIsEditing(false);
        setError(null);
        
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
          Profile updated successfully!
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
      console.error("Error updating profile:", error);
      if (error.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        localStorage.removeItem('token');
      } else {
        setError(error.response?.data?.error || "Failed to update profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading && !profileData.id) {
    return (
      <div className="admin-dashboard">
        <div className="main-content">
          <div className="content-container">
            <div className="loading" style={{
              textAlign: 'center',
              padding: '50px',
              fontSize: '18px',
              color: '#666'
            }}>
              Loading profile...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Simple Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <h2>Library System</h2>
          </div>
        </div>
        <div className="sidebar-menu">
          <div className="menu-item active">
            <span className="material-icons menu-icon">person</span>
            Profile
          </div>
        </div>
        <div className="sidebar-footer">
          <div className="menu-item" onClick={handleLogout}>
            <span className="material-icons menu-icon">logout</span>
            Log Out
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Simple Header */}
        <div className="top-header">
          <div className="user-info">
            <div className="user-avatar">
              <span className="material-icons">person</span>
            </div>
            <div className="user-details">
              <div className="user-name">{profileData.name}</div>
              <div className="user-role">{profileData.role}</div>
            </div>
          </div>
          <div className="time-info">
            <div className="time-display">{new Date().toLocaleTimeString()}</div>
            <div className="date-display">{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* Content Container */}
        <div className="content-container">
          <div className="content-header">
            <h1 className="page-title">Profile</h1>
            <div className="content-actions">
              {!isEditing ? (
                <button className="add-user-btn" onClick={handleEdit} disabled={loading}>
                  <span className="material-icons">edit</span>
                  {loading ? "Loading..." : "Edit Profile"}
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleSave}
                    disabled={loading}
                    style={{ opacity: loading ? 0.7 : 1 }}
                  >
                    <span className="material-icons">{loading ? "hourglass_empty" : "save"}</span>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <span className="material-icons">cancel</span>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="notification error" style={{
              marginBottom: '20px',
              animation: 'slideInRight 0.3s ease-out'
            }}>
              <span className="material-icons">error</span>
              {error}
            </div>
          )}

          {/* Profile Content */}
          <div className="profile-container">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  <img 
                    src={profileData.avatar} 
                    alt="Profile Avatar"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='35' r='25' fill='%23667eea'/%3E%3Cpath d='M15 85c0-19.33 15.67-35 35-35s35 15.67 35 35H15z' fill='%23667eea'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="profile-info">
                  <h2>{profileData.name || "User Name"}</h2>
                  <p className="profile-role" style={{
                    textTransform: 'capitalize',
                    color: profileData.role === 'manager' ? '#667eea' : 
                           profileData.role === 'librarian' ? '#f093fb' : '#56ab2f'
                  }}>
                    {profileData.role || "Member"}
                  </p>
                  <p className="profile-id">ID: {profileData.id || "N/A"}</p>
                </div>
              </div>

              <div className="profile-details">
                <div className="detail-section">
                  <h3>Personal Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      ) : (
                        <span>{profileData.name}</span>
                      )}
                    </div>
                    <div className="detail-item">
                      <label>Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      ) : (
                        <span>{profileData.email}</span>
                      )}
                    </div>
                    <div className="detail-item">
                      <label>Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Enter phone number"
                        />
                      ) : (
                        <span>{profileData.phone || "Not provided"}</span>
                      )}
                    </div>
                    <div className="detail-item">
                      <label>Street</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Enter street address"
                        />
                      ) : (
                        <span>{profileData.street || "Not provided"}</span>
                      )}
                    </div>
                    <div className="detail-item">
                      <label>District</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Enter district"
                        />
                      ) : (
                        <span>{profileData.district || "Not provided"}</span>
                      )}
                    </div>
                    <div className="detail-item">
                      <label>City</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Enter city"
                        />
                      ) : (
                        <span>{profileData.city || "Not provided"}</span>
                      )}
                    </div>
                    <div className="detail-item">
                      <label>Full Address</label>
                      <span>{profileData.address || "No address provided"}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Work Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Role</label>
                      <span style={{
                        textTransform: 'capitalize',
                        fontWeight: '600',
                        color: profileData.role === 'manager' ? '#667eea' : 
                               profileData.role === 'librarian' ? '#f093fb' : '#56ab2f'
                      }}>
                        {profileData.role || "Not assigned"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Department</label>
                      <span>{profileData.department || "Not assigned"}</span>
                    </div>
                    <div className="detail-item">
                      <label>Join Date</label>
                      <span>{profileData.joinDate || "Not available"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 