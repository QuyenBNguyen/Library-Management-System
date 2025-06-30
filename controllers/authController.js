// @desc    Handle authentication
// @route   POST /auth/login
const User = require('../models/user');
const Role = require('../models/role');

exports.login = async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(401).json({
        success: false,
        error: 'Username and password cannot be empty'
      });
    }
    
    // Check for admin credentials (admin = manager)
    if (username === 'admin' && password === '123') {
      // Find or create manager role (admin is manager)
      let managerRole = await Role.findOne({ name: 'manager' });
      if (!managerRole) {
        managerRole = await Role.create({ name: 'manager' });
      }
      
      // Find existing admin user or create one
      let adminUser = await User.findOne({ email: 'admin' }).populate('role');
      if (!adminUser) {
        adminUser = await User.create({
          name: 'Library Admin',
          email: 'admin',
          password: '123',
          role: managerRole._id
        });
      } else {
        // Update role to manager if it's different
        if (adminUser.role.name !== 'manager') {
          adminUser.role = managerRole._id;
          await adminUser.save();
          adminUser = await User.findById(adminUser._id).populate('role');
        }
      }
      
      return res.status(200).json({
        success: true,
        data: {
          _id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          token: adminUser._id
        }
      });
    }
    
    // Check for member user
    if (username === 'user' && password === '123') {
      // Find or create member role
      let memberRole = await Role.findOne({ name: 'member' });
      if (!memberRole) {
        memberRole = await Role.create({ name: 'member' });
      }
      
      // Find existing member user or create one
      let memberUser = await User.findOne({ email: 'user' }).populate('role');
      if (!memberUser) {
        memberUser = await User.create({
          name: 'Library Member',
          email: 'user',
          password: '123',
          role: memberRole._id
        });
      } else {
        // Update role to member if it's different
        if (memberUser.role.name !== 'member') {
          memberUser.role = memberRole._id;
          await memberUser.save();
          memberUser = await User.findById(memberUser._id).populate('role');
        }
      }
      
      return res.status(200).json({
        success: true,
        data: {
          _id: memberUser._id,
          name: memberUser.name,
          email: memberUser.email,
          role: memberUser.role,
          token: memberUser._id
        }
      });
    }

    // For other credentials, check database
    const user = await User.findOne({ email: username }).populate('role');
    
    if (!user) {
      // If user doesn't exist but credentials are not empty, create a regular member
      if (username && password) {
        // Find or create member role
        let memberRole = await Role.findOne({ name: 'member' });
        if (!memberRole) {
          memberRole = await Role.create({ name: 'member' });
        }

        // Create a member user
        const newMember = await User.create({
          name: username, // Using username as name
          email: username,
          password: password, // In a real app, you would hash this password
          role: memberRole._id
        });

        // Return new member user
        return res.status(200).json({
          success: true,
          data: {
            _id: newMember._id,
            name: newMember.name,
            email: newMember.email,
            role: {
              _id: memberRole._id,
              name: memberRole.name
            },
            token: newMember._id // Using user ID as token for simplicity
          }
        });
      } else {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
    }

    // Check password (in a real app, you would compare hashed passwords)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Return user info with token
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: user._id // Using user ID as token for simplicity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
