const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('466249058294-8vomsq4v0mde9ntvn55o79fm1cbs60hd.apps.googleusercontent.com');

// In-memory store for reset tokens (for demo; use DB in production)
const resetTokens = {};

// Google login endpoint
router.post('/google', async (req, res) => {
  const { idToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: '466249058294-8vomsq4v0mde9ntvn55o79fm1cbs60hd.apps.googleusercontent.com',
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, password: 'google-oauth', createdAt: new Date() });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(401).json({ message: 'Google authentication failed.' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({ name, email, password: hashed, emailVerified: false, verifyToken });

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    const verifyUrl = `https://quiz-master-r7lf.onrender.com/verify-email/${verifyToken}`;

    try {
      await transporter.sendMail({
        from: 'Quiz App <quizmaster725@gmail.com>',
        to: email,
        subject: 'Verify your email',
        html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`
      });
      res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' });
    } catch (emailErr) {
      console.error('Email send error:', emailErr); // <-- Add this line
      await User.deleteOne({ _id: user._id });
      res.status(500).json({ message: 'Registration failed: could not send verification email. Please try again later.' });
    }

  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Password reset: request reset
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });

  const token = crypto.randomBytes(32).toString('hex');
  resetTokens[token] = { userId: user._id, expires: Date.now() + 1000 * 60 * 15 }; // 15 min

  // Send email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const resetUrl = `https://quiz-master-r7lf.onrender.com/reset-password/${token}`;
  await transporter.sendMail({
    from: 'Quiz App <quizmaster725@gmail.com>',
    to: email,
    subject: 'Password Reset',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 15 minutes.</p>`
  });

  res.json({ message: 'If that email exists, a reset link has been sent.' });
});

// Password reset: set new password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const data = resetTokens[token];
  if (!data || data.expires < Date.now()) return res.status(400).json({ message: 'Invalid or expired token.' });

  const user = await User.findById(data.userId);
  if (!user) return res.status(400).json({ message: 'User not found.' });

  user.password = await bcrypt.hash(password, 10);
  await user.save();
  delete resetTokens[token];

  res.json({ message: 'Password has been reset.' });
});

// Email verification endpoint
router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ verifyToken: token });
  if (!user) return res.status(400).json({ message: 'Invalid token.' });

  user.emailVerified = true;
  user.verifyToken = undefined;
  await user.save();

  res.json({ message: 'Email verified! You can now log in.' });
});

module.exports = router; 