const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log("Signup body:", req.body); // 👈 Log input

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Email exists already");
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'member',
    });

    console.log("User created:", user); // 👈 Log success

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    console.error("Signup error:", err); // 👈 Log full error
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
