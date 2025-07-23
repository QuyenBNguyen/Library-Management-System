import React, { useState, useEffect } from "react";
import axios from "axios";
// import "../styles/dashboard.css"; // Bỏ import này nếu chỉ dùng CSS riêng cho profile

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
    city: "",
  });

  const [formData, setFormData] = useState({ ...profileData });
  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState("");

  // Thêm state avatarFile, avatarPreview
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [avatarToShow, setAvatarToShow] = useState(
    localStorage.getItem("lastAvatar") || "/images/avatar-placeholder.jpg"
  );
  const [oldAvatarUrl, setOldAvatarUrl] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [persistentAvatar, setPersistentAvatar] = useState(
    localStorage.getItem("lastAvatar") || "/images/avatar-placeholder.jpg"
  );

  // API base URL - backend runs on port 3000
  const API_BASE_URL = "http://localhost:5000";

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token");
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
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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

          joinDate: userData.createdAt
            ? new Date(userData.createdAt).toLocaleDateString()
            : "",
          address: `${userData.street || ""}, ${userData.district || ""}, ${
            userData.city || ""
          }`.trim(),
          avatar: userData.avatar || "",
          street: userData.street || "",
          district: userData.district || "",
          city: userData.city || "",
        };

        // Nếu chưa có avatar (user mới), luôn dùng avatar-placeholder
        let avatarUrl =
          profileInfo.avatar && profileInfo.avatar.startsWith("http")
            ? profileInfo.avatar
            : "/images/avatar-placeholder.jpg";
        setProfileData({ ...profileInfo, avatar: avatarUrl });
        setFormData({ ...profileInfo, avatar: avatarUrl });
        setAvatarPreview("");
        setPersistentAvatar(avatarUrl);
        setAvatarToShow(avatarUrl);
        // Chỉ update localStorage nếu là URL Cloudinary (ảnh thật)
        if (avatarUrl.startsWith("http")) {
          localStorage.setItem("lastAvatar", avatarUrl);
        } else {
          localStorage.removeItem("lastAvatar");
        }
        setLoadingProfile(false);
        console.log("Profile data:", profileInfo);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        localStorage.removeItem("token");
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

  // Đã import CSS file, không cần useEffect chèn style tag nữa

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
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
          setError(
            "Invalid phone number. It must be exactly 10 digits and start with 0."
          );
          return;
        }
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(formData.phone)) {
          setError(
            "Invalid phone number. It must be exactly 10 digits and start with 0."
          );
          return;
        }
      }
      let avatarUrl = profileData.avatar;
      if (avatarFile) {
        console.log("avatarFile:", avatarFile);
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        // Debug: log các entries của formData
        for (let pair of formData.entries()) {
          console.log("FormData:", pair[0], pair[1]);
        }
        try {
          const res = await axios.post(
            `${API_BASE_URL}/member/avatar/upload`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                // KHÔNG set Content-Type, axios sẽ tự động xử lý
              },
            }
          );
          if (res.data.success) {
            avatarUrl = res.data.avatar + "?v=" + Date.now();
            setIsAvatarLoading(true);
            setAvatarPreview(avatarUrl);
            setAvatarToShow(avatarUrl);
          }
        } catch (err) {
          setError("Failed to upload avatar");
          return;
        }
      } else {
        console.log("avatarFile is null or undefined!");
      }
      // Chuẩn bị dữ liệu update
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        street: formData.street,
        district: formData.district,
        city: formData.city,
        avatar: avatarUrl,
      };
      // Nếu là address thì tách lại thành street, district, city
      if (fieldValue === "address") {
        const [street, district, city] = fieldValue
          .split(",")
          .map((s) => s.trim());
        updateData.street = street || "";
        updateData.district = district || "";
        updateData.city = city || "";
        delete updateData.address;
      }
      const response = await axios.put(
        `${API_BASE_URL}/member/profile/me`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
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
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        const [street, district, city] = fieldValue
          .split(",")
          .map((s) => s.trim());
        updateData.street = street || "";
        updateData.district = district || "";
        updateData.city = city || "";
        delete updateData.address;
      }
      const response = await axios.put(
        `${API_BASE_URL}/member/profile/me`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        // Cập nhật lại profileData
        if (field === "address") {
          setProfileData((prev) => ({
            ...prev,
            street: updateData.street,
            district: updateData.district,
            city: updateData.city,
            address:
              `${updateData.street}, ${updateData.district}, ${updateData.city}`.trim(),
          }));
        } else {
          setProfileData((prev) => ({ ...prev, [field]: fieldValue }));
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
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(120deg, #f5e6c9 0%, #e1bb80 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="main-content">
          <div className="content-container">
            <div
              className="loading"
              style={{
                textAlign: "center",
                padding: "50px",
                fontSize: "18px",
                color: "#666",
              }}
            >
              Loading profile...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        //  background: "linear-gradient(120deg, #a97847ea 0%, #9a681eff 100%)",
        background: "##e1bb80",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
      // className="main-content"
      // style={{
      //   width: "100%",
      //   display: "flex",
      //   flexDirection: "column",
      //   alignItems: "center",
      //   justifyContent: "center",
      // }}
      >
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
        <div
          className="content-container"
          style={{ width: "100%", maxWidth: 600 }}
        >
          {/* <div className="content-header" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="page-title" style={{ textAlign: 'left' }}>Profile</h1>
          </div> */}

          {/* Error Message */}
          {error && (
            <div
              className="notification error"
              style={{
                marginBottom: "20px",
                animation: "slideInRight 0.3s ease-out",
              }}
            >
              <span className="material-icons">error</span>
              {error}
            </div>
          )}

          {/* Profile Content */}
          <div className="profile-container">
            <div className="profile-card">
              <div className="profile-header">
                <div
                  className="profile-avatar"
                  style={{ position: "relative" }}
                >
                  {loadingProfile ? (
                    <div
                      style={{
                        width: 96,
                        height: 96,
                        borderRadius: "50%",
                        background: "#eee",
                      }}
                    />
                  ) : (
                    <img
                      src={
                        loadingProfile
                          ? localStorage.getItem("lastAvatar") ||
                            "/images/avatar-placeholder.jpg"
                          : avatarPreview ||
                            avatarToShow ||
                            "/images/avatar-placeholder.jpg"
                      }
                      alt="Profile Avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                      onError={(e) => {
                        e.target.src = "/images/avatar-placeholder.jpg";
                      }}
                      onLoad={() => {
                        if (isAvatarLoading) {
                          setAvatarPreview("");
                          setIsAvatarLoading(false);
                        }
                      }}
                    />
                  )}
                  {isEditing && (
                    <label
                      htmlFor="avatar-upload"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        background: "#fff",
                        borderRadius: "50%",
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px #aaa",
                        cursor: "pointer",
                        border: "2px solid #e1bb80",
                      }}
                    >
                      <span
                        className="material-icons"
                        style={{ color: "#83552d", fontSize: 20 }}
                      >
                        edit
                      </span>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
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
                    <div
                      className="detail-item"
                      style={{ gridColumn: "1 / -1" }}
                    >
                      <label>Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Enter full name"
                          style={{ width: "100%" }}
                        />
                      ) : (
                        <span style={{ width: "100%" }}>
                          {profileData.name || "Not provided"}
                        </span>
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
                          style={{
                            background: "#eee",
                            color: "#aaa",
                            cursor: "not-allowed",
                            width: "100%",
                          }}
                        />
                      ) : (
                        <span style={{ width: "100%" }}>
                          {profileData.email || "Not provided"}
                        </span>
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
                            style={{ width: "100%" }}
                          />
                          {error && error.toLowerCase().includes("phone") && (
                            <div
                              style={{
                                color: "#ff416c",
                                fontSize: 13,
                                marginTop: 4,
                              }}
                            >
                              {error}
                            </div>
                          )}
                        </>
                      ) : (
                        <span style={{ width: "100%" }}>
                          {profileData.phone || "Not provided"}
                        </span>
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
                          style={{ width: "100%" }}
                        />
                      ) : (
                        <span style={{ width: "100%" }}>
                          {profileData.street || "Not provided"}
                        </span>
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
                          style={{ width: "100%" }}
                        />
                      ) : (
                        <span style={{ width: "100%" }}>
                          {profileData.district || "Not provided"}
                        </span>
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
                          style={{ width: "100%" }}
                        />
                      ) : (
                        <span style={{ width: "100%" }}>
                          {profileData.city || "Not provided"}
                        </span>
                      )}
                    </div>
                    <div
                      className="detail-item"
                      style={{ gridColumn: "1 / -1" }}
                    >
                      <label>Full Address</label>
                      <span style={{ width: "100%" }}>
                        {profileData.address || "No address provided"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 32,
                }}
              >
                {!isEditing ? (
                  <button
                    className="btn btn-primary"
                    onClick={handleEdit}
                    style={{ minWidth: 80 }}
                  >
                    <span
                      className="material-icons"
                      style={{ fontSize: 18, marginRight: 4 }}
                    >
                      edit
                    </span>{" "}
                    Edit
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      className="btn btn-primary"
                      onClick={handleSave}
                      disabled={loading}
                      style={{ minWidth: 80 }}
                    >
                      <span
                        className="material-icons"
                        style={{ fontSize: 18, marginRight: 4 }}
                      >
                        done
                      </span>{" "}
                      Done
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={loading}
                      style={{ minWidth: 80 }}
                    >
                      <span
                        className="material-icons"
                        style={{ fontSize: 18, marginRight: 4 }}
                      >
                        close
                      </span>{" "}
                      Cancel
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
