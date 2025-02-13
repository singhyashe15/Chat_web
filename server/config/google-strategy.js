import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import dotenv from "dotenv";
import UserModel from '../models/user.js';
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import {customAlphabet} from 'nanoid'
dotenv.config()


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
async function(accessToken, refreshToken, profile, cb) {
  try {
    let user =  await UserModel.findOne({email:profile.emails[0].value})
        
          if(!user){
            const code = customAlphabet('1234567890',5)
            const newcode = code()
            const salt = await bcryptjs.genSalt(10);
            const hashPass = await bcryptjs.hash(newcode,salt);
            // create the new user
            user = new UserModel({
              email:profile.emails[0].value,
              name:profile.displayName,
              password:hashPass,
            })
           await user.save()
          }
          const jwtsecret = process.env.JWT_SECRET_KEY
          
          const tokenData = {
            id:user?._id,
            email:user?.email
          }
          accessToken  =  jwt.sign(tokenData,jwtsecret,{ expiresIn : '30d'})
          console.log(refreshToken)
          return cb(null,user,accessToken)
        }
    catch (error) {
      console.log(error)
    }
}
));

export default passport;
