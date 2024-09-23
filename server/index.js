const express = require('express');
const cors = require('cors')
const http = require("http")
const router = require("./routes/index")
require('dotenv').config()
const cookiesParser = require('cookie-parser')
const connectDB = require('./config/database')

const {app,server} = require('./socket/socket')


// connect fronted https://chat-web-rho-nine.vercel.app
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow necessary methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(cookiesParser())

const PORT = process.env.PORT || 5000

app.use("/api",router)

connectDB().then(()=>{
  server.listen(PORT,()=>{
    console.log("sever running at "+ PORT)
  })
})
