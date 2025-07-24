import React, { useState, useEffect } from "react";
import axios from "axios";
// import "../styles/dashboard.css"; // Bỏ import này nếu chỉ dùng CSS riêng cho profile

// Thêm styled-components hoặc style tag cho CSS profile
const profileStyles = `
.profile-card {
    background: #fffbe9;
    border-radius: 18px;
    padding: 48px 48px;
    box-shadow: 0 4px 32px 0 rgba(102,126,234,0.08);
    border: 1.5px solid #e1bb80;
    max-width: 700px;
    margin: 40px auto 0 auto;
    transition: box-shadow 0.2s;
}
.profile-header {
    display: flex;
    align-items: center;
    gap: 28px;
    margin-bottom: 32px;
    border-bottom: 1.5px solid #e1bb80;
    padding-bottom: 18px;
    background: none;
    border-radius: 0;
    box-shadow: none;
}
.profile-avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #667eea;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
}
.profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.profile-info h2 {
    font-size: 26px;
    font-weight: 700;
    color: #543512;
    margin-bottom: 6px;
    letter-spacing: 0.5px;
}
.profile-role {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 4px;
    color: #667eea;
    text-transform: uppercase;
    letter-spacing: 1px;
}
.profile-id {
    font-size: 13px;
    color: #bfa76a;
    font-weight: 500;
}
.profile-details {
    display: flex;
    flex-direction: column;
    gap: 22px;
}
.detail-section {
    background: #fff;
    border-radius: 12px;
    padding: 18px 20px 10px 20px;
    border: 1px solid #f5e6c9;
    margin-bottom: 10px;
    box-shadow: 0 2px 8px 0 #e1bb8033;
}
.detail-section h3 {
    font-size: 17px;
    font-weight: 700;
    color: #83552d;
    margin-bottom: 12px;
    letter-spacing: 0.5px;
    background: none;
}
.detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px 24px;
}
@media (max-width: 600px) {
    .profile-card { padding: 18px 4px; }
    .detail-grid { grid-template-columns: 1fr; }
}
.detail-item label {
    font-size: 13px;
    font-weight: 600;
    color: #83552d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
}
.detail-item span {
    font-size: 15px;
    color: #543512;
    padding: 8px 12px;
    background: #fffbe9;
    border-radius: 7px;
    border: 1px solid #e1bb80;
    min-height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    transition: box-shadow 0.2s, background 0.2s;
}
.detail-item span .material-icons {
    margin-left: auto;
    color: #e1bb80;
    font-size: 20px;
    cursor: pointer;
    transition: color 0.2s;
}
.detail-item span .material-icons:hover {
    color: #667eea;
}
.detail-item .profile-edit-active {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fff;
    border-radius: 9px;
    box-shadow: 0 2px 12px 0 #e1bb8033;
    border: 1.5px solid #667eea;
    padding: 10px 16px;
    min-height: 44px;
    transition: box-shadow 0.2s, border 0.2s, background 0.2s;
}
.detail-item .profile-edit-active .form-control {
    flex: 1;
    font-size: 16px;
    padding: 10px 14px;
    border-radius: 7px;
    border: 1.5px solid #667eea;
    background: #fff;
    color: #543512;
    box-shadow: none;
    transition: border 0.2s, box-shadow 0.2s;
}
.detail-item .profile-edit-active .form-control:focus {
    border-color: #f093fb;
    box-shadow: 0 0 0 2px #f093fb33;
}
.detail-item .profile-edit-active .btn {
    padding: 8px 18px;
    font-size: 15px;
    border-radius: 7px;
    margin-left: 8px;
}
.btn, .add-user-btn {
    border-radius: 8px;
    font-weight: 700;
    letter-spacing: 0.5px;
    box-shadow: none;
    border: none;
    padding: 10px 22px;
    font-size: 15px;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}
.btn-primary, .add-user-btn {
    background: #667eea;
    color: #fff;
}
.btn-primary:hover, .add-user-btn:hover {
    background: #543512;
    color: #fffbe9;
    box-shadow: 0 2px 8px 0 #e1bb8033;
}
.btn-secondary {
    background: #f093fb;
    color: #543512;
}
.btn-secondary:hover {
    background: #e1bb80;
    color: #543512;
    box-shadow: 0 2px 8px 0 #f093fb33;
}
.form-control {
    border: 1.5px solid #e1bb80;
    border-radius: 7px;
    padding: 8px 12px;
    font-size: 15px;
    background: #fffbe9;
    color: #543512;
    transition: border-color 0.2s, box-shadow 0.2s;
}
.form-control:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px #667eea33;
    background: #fff;
}
.notification {
    padding: 14px 20px;
    margin-bottom: 12px;
    border-radius: 10px;
    color: #fff;
    font-weight: 600;
    display: flex;
    align-items: center;
    background: #f093fb;
    box-shadow: 0 2px 8px 0 #e1bb8033;
    border: none;
    position: relative;
    overflow: hidden;
    animation: slideInRight 0.4s ease, fadeOut 0.5s 3s forwards;
    max-width: 400px;
}
.notification.error {
    background: #ff416c;
}
.notification.success {
    background: #56ab2f;
}
`;

const editableFields = ["phone", "street", "district", "city", "address"];

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
  
    joinDate: "",
    address: "",
    avatar: "/images/avatar-placeholder.jpg",
    street: "",
    district: "",
    city: ""
  });

  const [formData, setFormData] = useState({ ...profileData });
  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState("");

  // Thêm state avatarFile, avatarPreview
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [avatarToShow, setAvatarToShow] = useState(localStorage.getItem("lastAvatar") || "/images/avatar-placeholder.jpg");
  const [oldAvatarUrl, setOldAvatarUrl] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [persistentAvatar, setPersistentAvatar] = useState(
    localStorage.getItem("lastAvatar") || "/images/avatar-placeholder.jpg"
  );

  // API base URL - backend runs on port 3000
  const API_BASE_URL = "http://localhost:5000";

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch profile data from API
  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
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
         
          joinDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "",
          address: `${userData.street || ""}, ${userData.district || ""}, ${userData.city || ""}`.trim(),
          avatar: userData.avatar ||"",
          street: userData.street || "",
          district: userData.district || "",
          city: userData.city || ""
        };
        
        const avatarUrl =
          (profileInfo.avatar && profileInfo.avatar.startsWith("http")) ?
            profileInfo.avatar :
            (localStorage.getItem("lastAvatar") || "/images/avatar-placeholder.jpg");
        setProfileData({ ...profileInfo, avatar: avatarUrl });
        setFormData({ ...profileInfo, avatar: avatarUrl });
        setAvatarPreview(""); // reset preview khi đã có avatar mới
        setPersistentAvatar(avatarUrl);
        setAvatarToShow(avatarUrl);
        // Chỉ update localStorage nếu là URL Cloudinary
        if (avatarUrl.startsWith("http")) {
          localStorage.setItem("lastAvatar", avatarUrl);
        }
        setLoadingProfile(false);
        console.log('Profile data:', profileInfo);
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

  useEffect(() => {
    // Thêm style tag vào head khi mount
    const styleTag = document.createElement('style');
    styleTag.innerHTML = profileStyles;
    document.head.appendChild(styleTag);
    return () => { document.head.removeChild(styleTag); };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  

  // Khi nhấn Edit chung
  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ ...profileData });
    setError(null);
  };

  // Khi chọn file avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Khi nhấn Done, upload avatar nếu có file mới
  const handleSave = async () => {
    setOldAvatarUrl(profileData.avatar);
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();
      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }
      // Validate số điện thoại
      if (formData.phone) {
        if (formData.phone.length > 10) {
          setError("Invalid phone number. It must be exactly 10 digits and start with 0.");
          return;
        }
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(formData.phone)) {
          setError("Invalid phone number. It must be exactly 10 digits and start with 0.");
          return;
        }
      }
      let avatarUrl = profileData.avatar;
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        try {
          const res = await axios.post(`${API_BASE_URL}/member/avatar/upload`, formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          if (res.data.success) {
            avatarUrl = res.data.avatar + '?v=' + Date.now();
            setIsAvatarLoading(true);
            setAvatarPreview(avatarUrl);
            setAvatarToShow(avatarUrl);
          }
        } catch (err) {
          setError('Failed to upload avatar');
          return;
        }
      }
      // Chuẩn bị dữ liệu update
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        street: formData.street,
        district: formData.district,
        city: formData.city,
        avatar: avatarUrl
      };
      // Nếu là address thì tách lại thành street, district, city
      if (fieldValue === "address") {
        const [street, district, city] = fieldValue.split(",").map(s => s.trim());
        updateData.street = street || "";
        updateData.district = district || "";
        updateData.city = city || "";
        delete updateData.address;
      }
      const response = await axios.put(`${API_BASE_URL}/member/profile/me`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        setIsEditing(false);
        setAvatarFile(null);
        if (avatarUrl !== oldAvatarUrl) {
          setAvatarPreview("");
        }
        setIsAvatarLoading(false);
        // Gọi lại fetchProfile để lấy dữ liệu mới nhất từ backend
        fetchProfile();
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...profileData });
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Hàm lưu từng trường
  const handleFieldEdit = (field) => {
    setEditingField(field);
    setFieldValue(profileData[field] || "");
    setError(null);
  };

  const handleFieldChange = (e) => {
    setFieldValue(e.target.value);
  };

  const handleFieldSave = async (field) => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();
      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }
      // Chuẩn bị dữ liệu update
      const updateData = { [field]: fieldValue };
      // Nếu là address thì tách lại thành street, district, city
      if (field === "address") {
        const [street, district, city] = fieldValue.split(",").map(s => s.trim());
        updateData.street = street || "";
        updateData.district = district || "";
        updateData.city = city || "";
        delete updateData.address;
      }
      const response = await axios.put(`${API_BASE_URL}/member/profile/me`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        // Cập nhật lại profileData
        if (field === "address") {
          setProfileData(prev => ({
            ...prev,
            street: updateData.street,
            district: updateData.district,
            city: updateData.city,
            address: `${updateData.street}, ${updateData.district}, ${updateData.city}`.trim()
          }));
        } else {
          setProfileData(prev => ({ ...prev, [field]: fieldValue }));
        }
        setEditingField(null);
        setFieldValue("");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData.id) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f5e6c9 0%, #e1bb80 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f5e6c9 0%, #e1bb80 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="main-content" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Simple Header */}
        {/* <div className="top-header" style={{ background: 'none', boxShadow: 'none', border: 'none', marginBottom: 0, justifyContent: 'flex-start', width: '100%', maxWidth: 600 }}>
          <div className="user-info">
            
            <div className="user-details">
              <div className="user-name">{profileData.name}</div>
              <div className="user-role">{profileData.role}</div>
            </div>
          </div>
        </div> */}

        {/* Content Container */}
        <div className="content-container" style={{ width: '100%', maxWidth: 600 }}>
          {/* <div className="content-header" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="page-title" style={{ textAlign: 'left' }}>Profile</h1>
          </div> */}

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
                <div className="profile-avatar" style={{ position: 'relative' }}>
                  {loadingProfile ? (
                    <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#eee' }} />
                  ) : (
                    <img
                      src={loadingProfile ? (localStorage.getItem("lastAvatar") || "/images/avatar-placeholder.jpg") : (avatarPreview || avatarToShow || "/images/avatar-placeholder.jpg")}
                      alt="Profile Avatar"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                      onError={(e) => { e.target.src = "/images/avatar-placeholder.jpg"; }}
                      onLoad={() => {
                        if (isAvatarLoading) {
                          setAvatarPreview("");
                          setIsAvatarLoading(false);
                        }
                      }}
                    />
                  )}
                  {isEditing && (
                    <label htmlFor="avatar-upload" style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      background: '#fff',
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px #aaa',
                      cursor: 'pointer',
                      border: '2px solid #e1bb80'
                    }}>
                      <span className="material-icons" style={{ color: '#83552d', fontSize: 20 }}>edit</span>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAvatarChange}
                      />
                    </label>
                  )}
                </div>
                <div className="profile-info">
                  <h2>{profileData.name || "User Name"}</h2>
                  <p className="profile-role">{profileData.role || "Member"}</p>
                 
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
                          placeholder="Enter full name"
                        />
                      ) : (
                        <span>{profileData.name || "Not provided"}</span>
                      )}
                    </div>
                    <div className="detail-item">
                      <label>Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          className="form-control"
                          placeholder="Enter email"
                          disabled
                          style={{ background: '#eee', color: '#aaa', cursor: 'not-allowed' }}
                        />
                      ) : (
                        <span>{profileData.email || "Not provided"}</span>
                      )}
                    </div>
                    <div className="detail-item">
                      <label>Phone</label>
                      {isEditing ? (
                        <>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Enter phone number"
                            maxLength={10}
                          />
                          {error && error.toLowerCase().includes('phone') && (
                            <div style={{ color: '#ff416c', fontSize: 13, marginTop: 4 }}>{error}</div>
                          )}
                        </>
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

              
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                {!isEditing ? (
                  <button className="btn btn-primary" onClick={handleEdit} style={{ minWidth: 80 }}>
                    <span className="material-icons" style={{ fontSize: 18, marginRight: 4 }}>edit</span> Edit
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-primary" onClick={handleSave} disabled={loading} style={{ minWidth: 80 }}>
                      <span className="material-icons" style={{ fontSize: 18, marginRight: 4 }}>done</span> Done
                    </button>
                    <button className="btn btn-secondary" onClick={handleCancel} disabled={loading} style={{ minWidth: 80 }}>
                      <span className="material-icons" style={{ fontSize: 18, marginRight: 4 }}>close</span> Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 