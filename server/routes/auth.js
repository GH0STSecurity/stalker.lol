const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/validate-token', authController.validateToken);
router.post('/reset-token', authController.resetToken);
router.post('/generate-uuid', authController.generateUUID);

// Protected routes example (for future use)
// router.get('/profile', auth, (req, res) => {
//   res.json({ success: true, user: req.user });
// });

// Admin routes example (for future use)
// router.get('/admin-dashboard', auth, isAdmin, (req, res) => {
//   res.json({ success: true, message: 'Admin dashboard access granted' });
// });

module.exports = router;
