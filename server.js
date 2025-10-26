const express = require('express');
const app = express()
const connectDb = require('./config/db.js')
const cors = require('cors')
const multer = require('multer')
require('dotenv').config()

// DB ki try chestunnam, please connect avvali ani anukuntunnam
const isConnected = connectDb()

app.use(cors())
// JSON ki permission ivvali, leka data confuse aipothundi
app.use(express.json())

// multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'), // uploads folder lo pettandi
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname) // unique name
})
const upload = multer({ storage })

// Serve uploaded images directly
app.use('/uploads', express.static('uploads')) // frontend ki image kanipinche shortcut

// Users ki routes
app.use('/api/user', require('./routes/userRoute.js'))
// Recipes ki routes (multer applied in route for /addRecipe)
app.use('/api/recipe', require('./routes/recipeRoute.js'))

// DB check chesi server start chesthunnam
if(isConnected){
  console.log("Database connection established 🥳") // DB connect ayindi, party time
  app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT ${process.env.PORT} 🚀`) // server flight start
  })
}else{
  console.error("Failed to connect to the database 😭") // DB lekunda panic ayyindi
}

// Optional: export multer if needed in other files
module.exports = upload
