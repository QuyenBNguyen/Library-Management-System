import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const OtpVerifyPage = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/auth/verify-otp", {
        email,
        otp,
      });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(120deg, #e0ffe0 0%, #f5f5f5 100%)",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: "2.5rem 2rem",
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#2d7a2d", marginBottom: 8 }}>
          Xác thực tài khoản
        </h2>
        <div style={{ color: "#666", fontSize: 15, marginBottom: 24 }}>
          Vui lòng nhập mã xác thực đã gửi về email của bạn.
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Nhập mã OTP"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: 18,
              borderRadius: 8,
              border: "1px solid #b2d8b2",
              marginBottom: 18,
              outline: "none",
              letterSpacing: 4,
              textAlign: "center",
            }}
            maxLength={6}
            required
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#2d7a2d",
              color: "#fff",
              fontWeight: 600,
              fontSize: 17,
              border: "none",
              borderRadius: 8,
              cursor: isLoading ? "not-allowed" : "pointer",
              marginBottom: 8,
              transition: "background 0.2s",
            }}
            disabled={isLoading}
          >
            {isLoading ? "Đang xác thực..." : "Xác thực"}
          </button>
        </form>
        {message && (
          <div
            style={{
              marginTop: 12,
              color:
                message.includes("thành công") || message.includes("success")
                  ? "#2d7a2d"
                  : "#d32f2f",
              fontWeight: 500,
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpVerifyPage;
