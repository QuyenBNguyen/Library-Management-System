import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "member",
    phone: "",
    street: "",
    district: "",
    city: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Create a copy of formData without confirmPassword
      const { confirmPassword, ...registerData } = formData;
      
      const res = await axios.post("http://localhost:5000/auth/register", registerData);
      console.log("Registration success", res.data);
      
      setSuccess("Registration successful! Redirecting to login...");
      setError("");
      
      // Auto-redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Registration failed");
      setSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <div className="register-logo-section">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Join our library management system</p>
        </div>

        <form className="register-form" onSubmit={handleRegister}>
          {error && <div className="error-text">{error}</div>}
          {success && <div className="success-text">{success}</div>}

          <div className="form-row">
            <input
              className="register-input"
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              className="register-input"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              className="register-input"
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              className="register-input"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <select
              className="register-input register-select"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="member">📚 Member</option>
              <option value="librarian">👨‍💼 Librarian</option>
              <option value="manager">👩‍💼 Manager</option>
            </select>
          </div>

          <div className="form-row">
            <input
              className="register-input"
              type="tel"
              name="phone"
              placeholder="Phone Number (Optional)"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="address-section">
            <h4 className="address-title">📍 Address (Optional)</h4>
            
            <div className="form-row">
              <input
                className="register-input"
                type="text"
                name="street"
                placeholder="Street Address"
                value={formData.street}
                onChange={handleChange}
              />
            </div>

            <div className="form-row form-row-double">
              <input
                className="register-input register-input-half"
                type="text"
                name="district"
                placeholder="District"
                value={formData.district}
                onChange={handleChange}
              />
              <input
                className="register-input register-input-half"
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "🚀 Create Account"}
          </button>
          
          <div className="login-link-section">
            <span className="login-text">Already have an account? </span>
            <button
              type="button"
              className="login-link-button"
              onClick={() => navigate("/login")}
            >
              Login here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;