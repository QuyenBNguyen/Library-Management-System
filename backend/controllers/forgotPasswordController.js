const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { sendVerificationEmail } = require("../utils/sendEmailFixed");

// Gửi mã OTP quên mật khẩu
exports.sendForgotOtp = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "Email không hợp lệ." });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: "Email không tồn tại trong hệ thống." });
    }

    // Check if user can request new OTP (rate limiting)
    const now = Date.now();
    const lastOtpTime = user.otpExpires ? (user.otpExpires - 5 * 60 * 1000) : 0;
    const timeSinceLastOtp = now - lastOtpTime;
    const minWaitTime = 60 * 1000; // 1 minute between requests
    
    if (timeSinceLastOtp < minWaitTime && user.otpExpires && user.otpExpires > now) {
      const remainingTime = Math.ceil((minWaitTime - timeSinceLastOtp) / 1000);
      return res.status(429).json({ 
        error: `Vui lòng đợi ${remainingTime} giây trước khi gửi lại OTP.`,
        remainingTime: remainingTime
      });
    }

    // Tạo mã OTP mới
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();
    
    console.log(`Sending OTP ${otp} to ${email}`); // For debugging
    
    try {
      await sendVerificationEmail(email, otp, false); // false for forgot password
      res.json({ 
        message: "Đã gửi mã xác thực đến email của bạn.",
        expiresIn: 300 // 5 minutes in seconds
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Reset OTP if email failed
      user.otp = null;
      user.otpExpires = null;
      await user.save();
      return res.status(500).json({ error: "Không thể gửi email. Vui lòng thử lại sau." });
    }
    
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ error: "Gửi mã xác thực thất bại. Vui lòng thử lại." });
  }
};

// Xác thực OTP và đổi mật khẩu
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Email không tồn tại." });
    if (user.otp !== otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ error: "Mã xác thực không đúng hoặc đã hết hạn." });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    res.json({ message: "Đổi mật khẩu thành công. Hãy đăng nhập lại." });
  } catch (err) {
    res.status(500).json({ error: "Đổi mật khẩu thất bại." });
  }
};
