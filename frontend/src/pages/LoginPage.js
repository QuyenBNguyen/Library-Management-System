import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate
import axios from "axios";
import logo from "../images/bookworm-logo-dark.svg";
import "../styles/login.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate(); // ✅ initialize navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/login",
        formData
      );
      console.log("Login success", res.data);

      // Save token to localStorage (optional)
      localStorage.setItem("token", res.data.token);

      if (res.data.user.role === "manager") {
        navigate("/dashboard"); // ✅ redirect to dashboard
      }
      if (res.data.user.role === "librarian") {
        navigate("/librarian");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="login-split-page">
      <div className="login-left-panel">
        <img src={logo} alt="Logo" className="login-logo" />
        <h2 className="login-title">Welcome Back !!</h2>
        <p className="login-subtitle">
          Please enter your credentials to log in
        </p>
        <form className="login-form" onSubmit={handleLogin}>
          {error && <div className="error-text">{error}</div>}

          <input
            className="login-input"
            type="email"
            name="email"
            placeholder="Username"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            className="login-input"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="login-options">
            <a href="#" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="login-button">
            SIGN IN
          </button>
        </form>
      </div>
      <div className="login-right-panel">
        <img src={logo} alt="Logo" className="login-logo right-logo" />
        <h1 className="brand-title">BookWorm</h1>
        <div className="brand-subtitle">LIBRARY</div>
        <div className="signup-prompt">New to our platform? Sign Up now.</div>
        <button className="signup-button" onClick={() => navigate("/register")}>
          SIGN UP
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
