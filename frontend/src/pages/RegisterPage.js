import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../images/bookworm-logo-dark.svg";
import "../styles/register.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      // Combine first and last name for backend
      const registerData = {
        name: formData.firstName || formData.lastName || 'User', // Handle single name input
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        // role: 'member' by default (handled in backend)
      };
      const res = await axios.post("http://localhost:5000/auth/register", registerData);
      setSuccess("Registration successful! Redirecting to login...");
      setError("");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      setSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-split-page">
      <div className="register-left-panel">
        <img src={logo} alt="Logo" className="register-logo" />
        <h1 className="brand-title">BookWorm</h1>
        <div className="brand-subtitle">LIBRARY</div>
        <div className="signin-prompt">Already have Account? Sign in now.</div>
        <button className="signin-button" onClick={() => navigate("/login")}>SIGN IN</button>
      </div>
      <div className="register-right-panel">
        <h2 className="register-title">Sign Up <img src={logo} alt="Logo" className="register-title-logo" /></h2>
        <p className="register-subtitle">Please provide your information to sign up.</p>
        <form className="register-form" onSubmit={handleRegister}>
          {error && <div className="error-text">{error}</div>}
          {success && <div className="success-text">{success}</div>}
          <div className="form-row form-row-double">
            <input
              className="register-input register-input-half"
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              className="register-input register-input-half"
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row form-row-double">
            <input
              className="register-input register-input-half"
              type="text"
              name="phone"
              placeholder="Contact No"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              className="register-input register-input-half"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row form-row-double">
            <input
              className="register-input register-input-half"
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              className="register-input register-input-half"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="register-button" disabled={isLoading}>
            {isLoading ? "Signing Up..." : "SIGN UP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;