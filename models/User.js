const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:true,
    unique:true
  },
  fullName:{
    type:String
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  passwordHash:{
    type:String,
    required:true
  },
  bio:{
    type:String
  },
  profileImage:{
    type:String,
    default:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
  },
  followers:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],
  following:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],
  createdAt:{
    type:Date,
    default:Date.now
  }
})

module.exports = mongoose.model('User',userSchema)