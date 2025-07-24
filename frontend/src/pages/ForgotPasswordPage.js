import React, { useState, useEffect } from "react";
import axios from "axios";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập otp + new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/forgot-password",
        { email }
      );
      setMessage(res.data.message);
      setStep(2);
      setCountdown(60); // 60 seconds countdown
      setCanResend(false);
    } catch (err) {
      if (err.response?.status === 429) {
        setMessage(err.response.data.error);
        setCountdown(err.response.data.remainingTime || 60);
        setCanResend(false);
      } else {
        setMessage(err.response?.data?.error || "Gửi mã xác thực thất bại");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    await handleSendOtp({ preventDefault: () => {} });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );
      setMessage(res.data.message);
      setTimeout(() => {
        window.location.href = "/login";
      }, 1800);
    } catch (err) {
      setMessage(err.response?.data?.error || "Đổi mật khẩu thất bại");
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
        background: "linear-gradient(120deg, #e0eaff 0%, #f5f5f5 100%)",
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
        <h2 style={{ color: "#1a4a8a", marginBottom: 8 }}>Quên mật khẩu</h2>
        <div style={{ color: "#666", fontSize: 15, marginBottom: 24 }}>
          {step === 1
            ? "Nhập email để nhận mã xác thực."
            : "Nhập mã xác thực và mật khẩu mới."}
        </div>
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email đăng ký"
              style={{
                width: "100%",
                padding: "12px",
                fontSize: 17,
                borderRadius: 8,
                border: "1px solid #b2c8e6",
                marginBottom: 18,
                outline: "none",
              }}
              required
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                background: "#1a4a8a",
                color: "#fff",
                fontWeight: 600,
                fontSize: 17,
                border: "none",
                borderRadius: 8,
                cursor: isLoading ? "not-allowed" : "pointer",
                marginBottom: 8,
              }}
              disabled={isLoading}
            >
              {isLoading ? "Đang gửi..." : "Gửi mã xác thực"}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <div style={{ marginBottom: 14 }}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Mã xác thực OTP"
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: 17,
                  borderRadius: 8,
                  border: "1px solid #b2c8e6",
                  outline: "none",
                  letterSpacing: 4,
                  textAlign: "center",
                }}
                maxLength={6}
                required
              />
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginTop: 8,
                fontSize: 14
              }}>
                <span style={{ color: "#666" }}>
                  {countdown > 0 && `Gửi lại sau ${countdown}s`}
                  {countdown === 0 && canResend && "Có thể gửi lại"}
                </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || isLoading}
                  style={{
                    background: "none",
                    border: "none",
                    color: canResend ? "#1a4a8a" : "#ccc",
                    cursor: canResend ? "pointer" : "not-allowed",
                    textDecoration: "underline",
                    fontSize: 14,
                  }}
                >
                  Gửi lại OTP
                </button>
              </div>
            </div>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
              style={{
                width: "100%",
                padding: "12px",
                fontSize: 17,
                borderRadius: 8,
                border: "1px solid #b2c8e6",
                marginBottom: 18,
                outline: "none",
              }}
              minLength={6}
              required
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                background: "#1a4a8a",
                color: "#fff",
                fontWeight: 600,
                fontSize: 17,
                border: "none",
                borderRadius: 8,
                cursor: isLoading ? "not-allowed" : "pointer",
                marginBottom: 8,
              }}
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>
          </form>
        )}
        {message && (
          <div
            style={{
              marginTop: 12,
              color: message.includes("thành công") ? "#2d7a2d" : "#d32f2f",
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

export default ForgotPasswordPage;
