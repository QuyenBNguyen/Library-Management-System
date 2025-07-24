const User = require("../models/user");
const bcrypt = require("bcryptjs");
const sendVerificationEmail = require("../utils/sendEmail");

// Gửi mã OTP quên mật khẩu
exports.sendForgotOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Email không tồn tại." });

    // Tạo mã OTP mới
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();
    await sendVerificationEmail(email, otp);
    res.json({ message: "Đã gửi mã xác thực đến email." });
  } catch (err) {
    res.status(500).json({ error: "Gửi mã xác thực thất bại." });
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
