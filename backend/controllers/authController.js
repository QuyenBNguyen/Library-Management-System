const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendVerificationEmail = require("../utils/sendEmail");

// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, role, phone, street, district, city } = req.body;

//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ error: 'Email already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     console.log("Registering:", email);
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: role || 'member',
//       phone,
//       street,
//       district,
//       city,
//     });

//     console.log("User created:", user);

//     const token = jwt.sign(
//       { _id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '2h' }
//     );

//     res.status(201).json({
//       message: 'Registered and logged in successfully',
//       token,
//       user: {
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         phone: user.phone,
//         street: user.street,
//         district: user.district,
//         city: user.city
//       }
//     });
//   } catch (err) {
//     console.error("Signup error:", err);
//     res.status(500).json({ error: 'Registration failed' });
//   }
// };
const isEmailDomainValid = require("../utils/verifyEmailReal");
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, street, district, city } =
      req.body;

    // 1. Kiểm tra email đã tồn tại
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // 2. Kiểm tra domain email có mail server thật không
    const isReal = await isEmailDomainValid(email);
    if (!isReal) {
      return res.status(400).json({
        error:
          "Email không tồn tại trên hệ thống mail thực. Vui lòng dùng email thật.",
      });
    }

    // 3. Tạo mã OTP 6 chữ số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Gửi OTP qua email thật trước, nếu gửi lỗi thì không tạo user
    try {
      await sendVerificationEmail(email, otp);
    } catch (e) {
      console.error("Send OTP email error:", e);
      return res
        .status(400)
        .json({
          error:
            "Email không tồn tại hoặc không nhận được mã xác thực. Vui lòng kiểm tra lại.",
        });
    }

    // 6. Tạo user mới sau khi gửi OTP thành công
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "member",
      phone,
      street,
      district,
      city,
      isVerified: false,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000, // OTP hết hạn sau 5 phút
    });

    // 7. Phản hồi thành công (không trả về OTP)
    res.status(201).json({
      message:
        "Register successful. Please check your email for the OTP to activate your account.",
      email,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("\n=== LOGIN ATTEMPT ===");
    console.log("Email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ error: "Invalid credentials" });
    }
    console.log("✅ User found:", { _id: user._id, role: user.role });

    // ✅ Kiểm tra xác thực email
    if (!user.isVerified) {
      console.log("❌ Email not verified");
      return res
        .status(403)
        .json({ error: "Please verify your email before logging in." });
    }

    const match = await bcrypt.compare(password, user.password);
    console.log("Password match:", match);

    if (!match) {
      console.log("❌ Password incorrect");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Debug: Kiểm tra JWT_SECRET
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    console.log("JWT_SECRET length:", process.env.JWT_SECRET?.length);

    const tokenPayload = { _id: user._id, role: user.role };
    console.log("Token payload:", tokenPayload);

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    console.log("✅ Token created successfully");
    console.log("Token preview:", token.substring(0, 20) + "...");
    console.log("=== LOGIN SUCCESS ===\n");

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("\n❌ Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Account already verified." });
    }

    if (user.otp !== otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res
      .status(200)
      .json({ message: "Account verified successfully. Please login." });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ error: "OTP verification failed." });
  }
};
