const express = require('express');
const app = express()

require('dotenv').config()
//env port is 3001
app.listen(process.env.PORT ,()=>{
  console.log(`Server running on PORT ${process.env.PORT}`)
})

