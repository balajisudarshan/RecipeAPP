const express = require('express');
const app = express()
const connectDb = require('./config/db.js')
const cors = require('cors')
require('dotenv').config()

const isConnected = connectDb()
app.use(cors())
app.use(express.json())

app.use('/api/user',require('./routes/userRoute.js'))
if(isConnected){
  console.log("Database connection established");
  app.listen(process.env.PORT ,()=>{
  console.log(`Server running on PORT ${process.env.PORT}`)
})
}else{
  console.error("Failed to connect to the database");
}


