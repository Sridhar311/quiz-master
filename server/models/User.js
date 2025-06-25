const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  emailVerified: { type: Boolean, default: false },
  verifyToken: { type: String },
});

module.exports = mongoose.model('User', userSchema); 