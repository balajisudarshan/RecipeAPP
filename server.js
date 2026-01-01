const express = require('express')
const app = express()
const connectDb = require('./config/db')
const cors = require('cors')
require('dotenv').config()

const isConnected = connectDb()

app.use(cors())
app.use(express.json())

app.use('/api/user', require('./routes/userRoute'))
app.use('/api/recipe', require('./routes/recipeRoute'))

if (isConnected) {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on PORT ${process.env.PORT}`)
  })
}
