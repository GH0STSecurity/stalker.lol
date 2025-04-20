const { User, Token } = require('../models');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

// Validate token
exports.validateToken = async (req, res) => {
  try {
    const { token } = req.body;
    console.log('Validating token:', token);

    if (!token) {
      console.log('No token provided');
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    // Check if it's the admin token
    if (token === process.env.ADMIN_TOKEN) {
      console.log('Admin token validated successfully');
      return res.status(200).json({
        success: true,
        isAdmin: true,
        message: 'Admin token validated successfully'
      });
    }

    // Find the token in the database
    console.log('Looking for token in database...');
    const tokenRecord = await Token.findOne({
      where: {
        token,
        isRevoked: false,
        expiresAt: { [Op.gt]: new Date() }
      },
      include: [{ model: User, as: 'user' }]
    });

    if (!tokenRecord) {
      console.log('Token not found or expired');
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    console.log('Token found:', tokenRecord.token);
    console.log('User UUID:', tokenRecord.user.uuid);

    // Update last login time
    await tokenRecord.user.update({ lastLogin: new Date() });

    return res.status(200).json({
      success: true,
      isAdmin: tokenRecord.user.isAdmin,
      uuid: tokenRecord.user.uuid,
      message: 'Token validated successfully'
    });

  } catch (error) {
    console.error('Token validation error:', error);
    return res.status(500).json({ success: false, message: 'Server error during validation' });
  }
};

// Reset token
exports.resetToken = async (req, res) => {
  try {
    const { uuid, password } = req.body;
    console.log('Resetting token for UUID:', uuid);

    if (!uuid || !password) {
      console.log('Missing UUID or password');
      return res.status(400).json({ success: false, message: 'UUID and password are required' });
    }

    // Find the user
    console.log('Looking for user with UUID:', uuid);
    const user = await User.findByPk(uuid);
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ success: false, message: 'Invalid UUID or password' });
    }

    console.log('User found, validating password');
    // Verify password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({ success: false, message: 'Invalid UUID or password' });
    }

    console.log('Password validated, generating new token');
    // Generate new token
    const newToken = await Token.createForUser(user.uuid);
    console.log('New token generated:', newToken.token);

    return res.status(200).json({
      success: true,
      token: newToken.token,
      message: 'Token reset successfully'
    });

  } catch (error) {
    console.error('Token reset error:', error);
    return res.status(500).json({ success: false, message: 'Server error during token reset' });
  }
};

// Generate new UUID and token
exports.generateUUID = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    // Create new user
    const user = await User.create({
      passwordHash: password
    });

    // Generate token for the user
    const token = await Token.createForUser(user.uuid);

    return res.status(201).json({
      success: true,
      uuid: user.uuid,
      token: token.token,
      message: 'UUID and token generated successfully'
    });

  } catch (error) {
    console.error('UUID generation error:', error);
    return res.status(500).json({ success: false, message: 'Server error during UUID generation' });
  }
};
