const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, street, district, city } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Registering:", email);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'member',
      phone,
      street,
      district,
      city,
    });
    
    console.log("User created:", user);

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(201).json({
      message: 'Registered and logged in successfully',
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        street: user.street,
        district: user.district,
        city: user.city
      }
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: 'Registration failed' });
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
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    console.log("✅ User found:", { _id: user._id, role: user.role });

    const match = await bcrypt.compare(password, user.password);
    console.log("Password match:", match);

    if (!match) {
      console.log("❌ Password incorrect");
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Debug: Kiểm tra JWT_SECRET
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    console.log("JWT_SECRET length:", process.env.JWT_SECRET?.length);

    const tokenPayload = { _id: user._id, role: user.role };
    console.log("Token payload:", tokenPayload);

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    console.log("✅ Token created successfully");
    console.log("Token preview:", token.substring(0, 20) + "...");
    console.log("=== LOGIN SUCCESS ===\n");

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
    console.error("\n❌ Login error:", err);
    res.status(500).json({ error: 'Login failed' });
  }
};
