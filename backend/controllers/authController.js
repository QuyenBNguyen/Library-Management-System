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
      { id: user._id, role: user.role },
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
    console.log("Login attempt:", email);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    console.log("User found:", user);

    const match = await bcrypt.compare(password, user.password);
    console.log("Password match:", match);

    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token, user: { name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);  // See the real issue here
    res.status(500).json({ error: 'Login failed' });
  }
};
