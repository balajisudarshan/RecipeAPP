const bcrypt = require('bcryptjs');
const User = require('../models/User');

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUserData = {
      username,
      fullName,
      email,
      passwordHash: hashedPassword,
    };

    if (bio?.trim()) newUserData.bio = bio.trim();
    if (profileImage?.trim()) newUserData.profileImage = profileImage.trim();

    const newUser = new User(newUserData);
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" ,error:error.message});
  }
};

module.exports = {
  registerUser,
};
