const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const recipe = require('../models/Recipe');
const { sendLoginNotification } = require('../utils/email.js')
require('dotenv').config();

const registerUser = async (req, res) => {
  const { username, fullName, email, password, bio, profileImage } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required." });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists." });
    }

    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      fullName,
      email,
      passwordHash: hashedPassword,
      isVerified: true, // Mark verified directly
      bio: bio?.trim(),
      profileImage: profileImage?.trim()
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, tokenVersion: user.tokenVersion }, process.env.JWT_SECRET, { expiresIn: '2d' });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { username: newUser.username, email: newUser.email }
    });

  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email, username: user.username, tokenVersion: user.tokenVersion }, process.env.JWT_SECRET, { expiresIn: '2d' });
    res.status(200).json({ message: "Login successful", token, user: { username: user.username, email: user.email } });
    console.log(`📧 Preparing to send login email to ${user.email}`);
    setImmediate(() => {
      sendLoginNotification(user.email, user.username)
        .then(() => console.log('✅ Login email sent'))
        .catch(err => console.error('❌ Login email error:', err));
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

const getUserProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const resUser = await User.findById(id).select('-passwordHash');
    if (!resUser) return res.status(404).json({ message: "User not found" });

    const recipes = await recipe.find({ createdBy: id });
    res.status(200).json({ user: resUser, recipes });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  login,
  profile,
  getUserProfile
};
