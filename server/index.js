import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from 'http'
import router from './routes/index.js'
import dotenv from "dotenv";
dotenv.config()
import {connectDB} from './config/database.js'


import {app,server} from './socket/socket.js'


app.use(cors({
  origin: process.env.Fronted_Url,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow necessary methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.text())
app.use(cookieParser())

const PORT = process.env.PORT || 5000

app.use("/api",router)

connectDB().then(()=>{
  server.listen(PORT,()=>{
    console.log("sever running at "+ PORT)
  })
})
