const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const recipe = require('../models/Recipe');

const { generateOtp, sendOtp, sendEmail, sendMessage, generateTemplate } = require('../mailer.js');

require('dotenv').config();
const registerUser = async (req, res) => {
  const { username, fullName, email, password, bio, profileImage } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required." });
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (!existingUser.isVerified) {
        // 🔥 Delete the unverified record
        await User.deleteOne({ _id: existingUser._id });
      } else {
        return res.status(400).json({ message: "Username or email already exists." });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOtp();

    const newUserData = {
      username,
      fullName,
      email,
      passwordHash: hashedPassword,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000, // 5 minutes
      isVerified: false,
    };

    if (bio?.trim()) newUserData.bio = bio.trim();
    if (profileImage?.trim()) newUserData.profileImage = profileImage.trim();

    // Save new user
    const newUser = new User(newUserData);
    await newUser.save();

    // Send OTP
    await sendOtp(email, otp);

    return res.status(201).json({ message: "OTP sent to your email for verification" });
  } catch (error) {
    console.error("Register error:", error.message, error.stack);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    if (user.otpExpiry < Date.now()) {
      await User.deleteOne({ email });
      return res.status(400).json({ message: "OTP expired. Please register again." });
    }

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const reSendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" })
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();
    await sendOtp(email, otp);
    res.status(200).json({ message: "OTP resent to your email" })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message })
  }

}

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // if (!user.isVerified) {
    //   const otp = generateOTP();
    //   user.otp = otp;
    //   user.otpExpires = Date.now() + 5 * 60 * 1000;
    //   await user.save();
    //   await sendOTP(email, otp);
    //   return res.status(403).json({ message: "OTP sent to email. Please verify your account." });
    // }

    const subject = "New Login Alert";
    const message = "A new login to your account was detected. If this was not you, please secure your account immediately.";
    const html = generateTemplate(subject, `<p>${message}</p>`, `© ${new Date().getFullYear()} DishCOvery`);

    await sendEmail(user.email, subject, message, html);

    // await generateTemplate(user.email,"New Login Alert","A new login to your account was detected. If this was not you, please secure your account immediately.")
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2d' })
    res.status(200).json({ message: "Login successfull", token, user: { username: user.username, email: user.email } });

  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message })
  }
}

const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Internal server eror", error: err.message })
  }
}
const getUserProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const resUser = await User.findById(id).select('-passwordHash');
    if (!resUser) {
      return res.status(404).json({ message: "User not found" })
    }
    const recipes = await recipe.find({ createdBy: id })
    res.status(200).json({ user: resUser, recipes })
  } catch (error) {

  }
}
module.exports = {
  registerUser,
  login,
  profile,
  getUserProfile,
  verifyOtp,
  reSendOtp
};
