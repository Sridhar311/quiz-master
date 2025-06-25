const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Middleware to check if user is admin (by email)
function isAdmin(req, res, next) {
  // You can improve this by using a role field in the User model
  User.findById(req.user).then(user => {
    if (user && user.email === 'admin12@gmail.com') {
      next();
    } else {
      res.status(403).json({ message: 'Admin access required.' });
    }
  });
}

// Get all users (admin only)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Delete a user (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 