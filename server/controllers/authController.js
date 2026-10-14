const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isValidEmail, isStrongPassword, normalizeEmail } = require('../utils/validators');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (typeof name !== 'string' || !name.trim() || name.trim().length > 60 || !email || !password) {
      return res.status(400).json({ message: 'A name (up to 60 characters), email and password are required' });
    }
    if (!isValidEmail(email)) return res.status(400).json({ message: 'Please provide a valid email address' });
    if (!isStrongPassword(password)) return res.status(400).json({ message: 'Password must be 12–128 characters long' });
    const existing = await User.findOne({ email: normalizeEmail(email) });
    if (existing) return res.status(409).json({ message: 'An account with this email already exists' });
    const user = await User.create({ name: name.trim(), email: normalizeEmail(email), password });
    const token = signToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!isValidEmail(email) || typeof password !== 'string' || password.length > 128 || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email: normalizeEmail(email) }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
};

module.exports = { register, login, getMe };