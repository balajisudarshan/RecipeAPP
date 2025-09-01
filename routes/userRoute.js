const express = require('express')
const router = express.Router()
const User  = require('../models/User.js')
const bcrypt = require('bcryptjs')
const verifyToken = require('../middleware/auth.js')
const { registerUser,login,profile,getUserProfile,verifyOtp,reSendOtp } = require('../controllers/UserController.js')



// router.get('/', (req, res) => {
//   res.send('User route is working')
// })

router.post('/register',registerUser)

router.post('/login',login)
router.post('/verify-otp',verifyOtp)
router.post('/resend-otp',reSendOtp)
router.get('/profile',verifyToken,profile)
router.get('/getUserProfile/:id',getUserProfile)
module.exports = router