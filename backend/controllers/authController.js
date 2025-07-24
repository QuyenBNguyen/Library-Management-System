const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/sendEmailFixed');

exports.register = async (req, res) => {
  try {
    const { name, username, email, password, role, phone, street, district, city } = req.body;

    // Use username if name is not provided (for backward compatibility)
    const displayName = name || username;

    // Validate required fields
    if (!displayName || !email || !password) {
      return res.status(400).json({ error: 'Name/username, email, and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle role (convert 'admin' to 'manager' for compatibility)
    const userRole = role === 'admin' ? 'manager' : (role || 'member');

    // Generate OTP for email verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name: displayName.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: userRole,
      phone: phone?.trim(),
      street: street?.trim(),
      district: district?.trim(),
      city: city?.trim(),
      otp: otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
      isVerified: false // Require email verification
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, otp, true); // true for registration
      console.log(`Registration OTP sent to ${email}: ${otp}`);
    } catch (emailError) {
      console.error('Email sending failed during registration:', emailError);
      // Don't fail registration if email fails, user can resend
    }

    res.status(201).json({
      message: 'Registration successful! Please check your email for verification code.',
      email: user.email,
      requiresVerification: true
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if user is banned
    if (user.status === 'banned') {
      return res.status(403).json({ error: 'Your account has been banned. Please contact administrator.' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({ 
        error: 'Please verify your email first. Check your inbox for verification code.',
        requiresVerification: true,
        email: user.email
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      user: { 
        _id: user._id,
        name: user.name, 
        role: user.role, 
        email: user.email 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// Verify OTP for email verification
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    if (user.otp !== otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ 
      message: 'Email verified successfully. You can now login.',
      verified: true 
    });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
};

// Resend OTP for email verification
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    // Check rate limiting (1 minute between requests)
    const now = Date.now();
    const lastOtpTime = user.otpExpires ? (user.otpExpires - 10 * 60 * 1000) : 0;
    const timeSinceLastOtp = now - lastOtpTime;
    const minWaitTime = 60 * 1000; // 1 minute

    if (timeSinceLastOtp < minWaitTime && user.otpExpires && user.otpExpires > now) {
      const remainingTime = Math.ceil((minWaitTime - timeSinceLastOtp) / 1000);
      return res.status(429).json({ 
        error: `Please wait ${remainingTime} seconds before requesting a new OTP`,
        remainingTime: remainingTime
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, otp, true); // true for registration
      console.log(`Resend OTP sent to ${email}: ${otp}`);
      res.json({ 
        message: 'Verification code sent to your email',
        expiresIn: 600 // 10 minutes in seconds
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Reset OTP if email failed
      user.otp = null;
      user.otpExpires = null;
      await user.save();
      return res.status(500).json({ error: 'Failed to send email. Please try again.' });
    }

  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ error: 'Failed to resend verification code' });
  }
};
