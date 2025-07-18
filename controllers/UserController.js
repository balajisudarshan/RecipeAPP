const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
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
const login = async(req,res)=>{
  const {email,password} = req.body;

  try {
    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({message:"User not found"})
    }
    const isMatch = await bcrypt.compare(password,user.passwordHash);
    if(!isMatch){
      return res.status(400).json({message:"Invalid credentials"})
    }
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'2d'})
    res.status(200).json({message:"Login successfull", token, user: { username: user.username, email: user.email }});

  } catch (error) {
    return res.status(500).json({message:"Internal server error",error:error.message})
  }
}

const profile = async(req,res)=>{
  try{
    const user = await User.findById(req.user.id).select('-passwordHash');
    if(!user){
      return res.status(404).json({message:"User not found"})
    }
    res.status(200).json({user});
  }catch(err){
    return res.status(500).json({message:"Internal server eror",error:err.message})
  }
}
module.exports = {
  registerUser,
  login,
  profile
};
