const express = require('express')

const router = express.Router()
const User  = require('../models/User.js')
const bcrypt = require('bcryptjs')
const { registerUser,login } = require('../controllers/UserController.js')
router.get('/', (req, res) => {
  res.send('User route is working')
})
router.post('/register',registerUser)
router.post('/login',login)
module.exports = router