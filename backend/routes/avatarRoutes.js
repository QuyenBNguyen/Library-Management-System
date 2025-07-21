const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avatars',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 256, height: 256, crop: 'limit' }]
  }
});

const upload = multer({ storage });

router.post('/upload', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.avatar = req.file.path; // This is the public URL on Cloudinary
    await user.save();
    
    res.json({ success: true, avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router; 