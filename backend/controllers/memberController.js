const User = require("../models/user");

// @desc    Get all members
// @route   GET /members
// @access  manager, librarian
exports.getAllMembers = async (req, res) => {
  try {
    const members = await User.find();
    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get single member
// @route   GET /members/:id
// @access  manager, librarian
exports.getMemberById = async (req, res) => {
  try {
    const member = await User.findById(req.params.id);
    if (!member) {
      return res
        .status(404)
        .json({ success: false, error: "Member not found" });
    }
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new member
// @route   POST /members
// @access  manager
exports.createMember = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "member", // default role
      phone,
      street,
      district,
      city,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Name and email are required",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, error: "Email already in use" });
    }

    const member = await User.create({
      name,
      email,
      password,
      role,
      phone,
      street,
      district,
      city,
    });

    res.status(201).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update member
// @route   PUT /members/:id
// @access  manager
exports.updateMember = async (req, res) => {
  try {
    const updates = req.body;
    const member = await User.findById(req.params.id);

    if (!member) {
      return res
        .status(404)
        .json({ success: false, error: "Member not found" });
    }

    Object.assign(member, updates);
    const updated = await member.save();

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete member
// @route   DELETE /members/:id
// @access  manager
exports.deleteMember = async (req, res) => {
  try {
    const member = await User.findById(req.params.id);
    if (!member) {
      return res
        .status(404)
        .json({ success: false, error: "Member not found" });
    }

    await member.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update member role
// @route   PUT /members/:id/role
// @access  admin
exports.updateMemberRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res
        .status(400)
        .json({ success: false, error: "Role is required" });
    }

    const member = await User.findById(req.params.id);
    if (!member) {
      return res
        .status(404)
        .json({ success: false, error: "Member not found" });
    }

    member.role = role;
    const updated = await member.save();

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get current member profile
// @route   GET /member/profile
exports.memberGetProfile = async (req, res) => {
  try {
    // req.user đã được authMiddleware gán
    const user = await User.findById(req.user._id).populate("role", "name");
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Update current member profile
// @route   PUT /member/profile/me
exports.updateMemberProfile = async (req, res) => {
  try {
    const { name, email, phone, street, district, city, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (street) user.street = street;
    if (district) user.district = district;
    if (city) user.city = city;
    if (avatar) user.avatar = avatar;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Change password
// @route   PUT /member/change-password
exports.changePassword = async (req, res) => {
  try {
    console.log("Change password request received");
    const { currentPassword, newPassword } = req.body;
    console.log("Request body:", {
      currentPassword: "***",
      newPassword: "***",
    });
    console.log("User ID from token:", req.user._id);

    // Validate input
    if (!currentPassword || !newPassword) {
      console.log("Missing required fields");
      return res.status(400).json({
        success: false,
        error: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      console.log("New password too short");
      return res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters long",
      });
    }

    // Check if new password is different from current password
    if (currentPassword === newPassword) {
      console.log("New password is same as current password");
      return res.status(400).json({
        success: false,
        error: "New password must be different from current password",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      console.log("User not found:", req.user._id);
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Verify current password
    const bcrypt = require("bcryptjs");
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      console.log("Current password is incorrect");
      return res.status(400).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedNewPassword;
    await user.save();
    console.log("Password updated successfully for user:", user._id);

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    });
  }
};
