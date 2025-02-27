import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from 'http'
import router from './routes/index.js'
import dotenv from "dotenv";
dotenv.config()
import {connectDB} from './config/database.js'
import passport from "passport";
import './config/google-strategy.js'

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
app.use(passport.initialize()); 


app.get('/auth/google', passport.authenticate('google', {session: false,scope: ['profile','email'] }));


app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.Fronted_Url}/login`,
  }),
  (req, res) => {
    const accessToken = req.authInfo;
    console.log(accessToken)
   
    res.cookie('token',accessToken,{
      httpOnly: true,  // Prevents client-side access for security
      secure:process.env.NODE_ENV === "production",
      sameSite: 'none',
    });
    
    res.redirect(`${process.env.Fronted_Url}/authEmail`); // Redirect to frontend
  }
);

const PORT = process.env.PORT || 5000

app.use("/api",router)

connectDB().then(()=>{
  server.listen(PORT,()=>{
    console.log("sever running at "+ PORT)
  })
})
