const User = require('../models/user');

// @desc    Member view endpoints (view only)
// @route   Various /member routes

exports.memberGetAllMembers = async (req, res) => {
  try {
    const members = await User.find().populate('role', 'name');
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.memberGetMemberById = async (req, res) => {
  try {
    const member = await User.findById(req.params.id).populate('role', 'name');
    
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all members
// @route   GET /members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await User.find().populate('role', 'name');
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single member
// @route   GET /members/:id
exports.getMemberById = async (req, res) => {
  try {
    const member = await User.findById(req.params.id).populate('role', 'name');
    
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new member
// @route   POST /members
exports.createMember = async (req, res) => {
  try {
    const { name, email, password, role, phone, street, district, city } = req.body;

    // Simple validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name and email'
      });
    }

    // Check if member with this email already exists
    const existingMember = await User.findOne({ email });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        error: 'Email already in use'
      });
    }

    const member = await User.create({
      name,
      email,
      password,
      role,
      phone,
      street,
      district,
      city
    });

    res.status(201).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update member
// @route   PUT /members/:id
exports.updateMember = async (req, res) => {
  try {
    const { name, email, password, role, phone, street, district, city } = req.body;

    let member = await User.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    // Handle role update if provided
    if (role) {
      const Role = require('../models/role');
      const roleDoc = await Role.findOne({ name: role });
      if (!roleDoc) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role specified'
        });
      }
      member.role = roleDoc._id;
    }

    // Update other fields only if they are provided and not empty
    if (name !== undefined && name !== '') member.name = name;
    if (email !== undefined && email !== '') member.email = email;
    if (password !== undefined && password !== '') member.password = password;
    if (phone !== undefined) member.phone = phone;
    if (street !== undefined) member.street = street;
    if (district !== undefined) member.district = district;
    if (city !== undefined) member.city = city;

    member = await member.save();
    
    // Populate role for response
    await member.populate('role', 'name');

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete member
// @route   DELETE /members/:id
exports.deleteMember = async (req, res) => {
  try {
    const member = await User.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Manager endpoints for member management
// @route   Various /manager/members routes

exports.managerGetAllMembers = async (req, res) => {
  try {
    const members = await User.find().populate('role', 'name');
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.managerGetMemberById = async (req, res) => {
  try {
    const member = await User.findById(req.params.id).populate('role', 'name');
    
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.managerCreateMember = async (req, res) => {
  try {
    const { name, email, password, phone, street, district, city } = req.body;

    // Simple validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name and email'
      });
    }

    // Check if member with this email already exists
    const existingMember = await User.findOne({ email });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        error: 'Email already in use'
      });
    }

    // Get the member role
    const Role = require('../models/role');
    let memberRole = await Role.findOne({ name: 'member' });
    
    // If member role doesn't exist, create it
    if (!memberRole) {
      memberRole = await Role.create({ name: 'member' });
    }

    // Create the new member with the member role
    const member = await User.create({
      name,
      email,
      password,
      role: memberRole._id,
      phone, 
      street,
      district,
      city
    });
    
    res.status(201).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.managerUpdateMember = async (req, res) => {
  try {
    const { name, email, password, role, phone, street, district, city } = req.body;

    // Simple validation if both fields are present
    if (name === '' || email === '') {
      return res.status(400).json({
        success: false,
        error: 'Name and email cannot be empty strings'
      });
    }

    let member = await User.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    // Update fields
    if (name) member.name = name;
    if (email) member.email = email;
    if (password) member.password = password;
    if (role) member.role = role;
    if (phone !== undefined) member.phone = phone;
    if (street !== undefined) member.street = street;
    if (district !== undefined) member.district = district;
    if (city !== undefined) member.city = city;

    await member.save();

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.managerDeleteMember = async (req, res) => {
  try {
    const member = await User.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Admin view member endpoints
// @route   Various /admin/members routes

exports.adminGetAllMembers = async (req, res) => {
  try {
    const members = await User.find().populate('role', 'name');
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.adminGetMemberById = async (req, res) => {
  try {
    const member = await User.findById(req.params.id).populate('role', 'name');
    
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Admin update member role only
// @route   PUT /admin/members/:id/role
exports.adminUpdateMemberRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    // Validate role
    if (!role) {
      return res.status(400).json({
        success: false,
        error: 'Role is required'
      });
    }
    
    // Check if role is valid
    const Role = require('../models/role');
    const roleDoc = await Role.findOne({ name: role });
    if (!roleDoc) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role specified'
      });
    }
    
    let member = await User.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }
    
    // Update only the role
    member.role = roleDoc._id;
    member = await member.save();
    
    // Populate role for response
    await member.populate('role', 'name');
    
    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
