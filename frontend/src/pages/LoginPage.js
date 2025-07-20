import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate
import axios from "axios";
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

      if (
        res.data.user.role === "manager" ||
        res.data.user.role === "librarian"
      ) {
        navigate("/dashboard"); // ✅ redirect to dashboard
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box mt-24">
        <div className="flex justify-center items-center">
          <img
            src={"http://localhost:3000/images/bookworm-logo-dark.svg"}
            alt="Logo"
            className="login-logo"
          />
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          {error && <div className="error-text">{error}</div>}

          <input
            className="login-input"
            type="email"
            name="email"
            placeholder="Email"
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
            Login
          </button>
          <button
            type="button"
            className="register-button"
            onClick={() => navigate("/register")} // ✅ use navigate here too
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
