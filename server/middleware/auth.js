const { Token, User } = require('../models');
const { Op } = require('sequelize');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No authentication token, access denied' });
    }

    // Check if it's the admin token
    if (token === process.env.ADMIN_TOKEN) {
      req.user = { isAdmin: true };
      return next();
    }

    // Find the token in the database
    const tokenRecord = await Token.findOne({
      where: {
        token,
        isRevoked: false,
        expiresAt: { [Op.gt]: new Date() }
      },
      include: [{ model: User, as: 'user' }]
    });

    if (!tokenRecord) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    // Set user in request
    req.user = tokenRecord.user;
    req.token = tokenRecord;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ success: false, message: 'Server error during authentication' });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
  }
  next();
};

module.exports = { auth, isAdmin };
