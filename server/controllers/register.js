import UserModel from '../models/user.js';
import verificationCode from '../models/verification.js';
import sendEmail from './sendemail.js'
import bcryptjs from 'bcryptjs'
import {customAlphabet} from 'nanoid'

const register = async(req,res)=>{
  try{
    const {name,email,password,profile_pic} = req.body;
    console.log(process.env.MONGODB_URL);
    const checkEmail = await UserModel.findOne({email});
    
    // if found
    if(checkEmail){
      return res.status(400).json({
        message:"Already email registered",
        error:true
      })
    }
    
    const salt = await bcryptjs.genSalt(10);
    const hashPass = await bcryptjs.hash(password,salt);
    
    const payload = {
      name,email,password:hashPass,profile_pic
    }
    
    const user = new UserModel(payload); // storing the data
    const savedata = await user.save();

    // generating the verification code
    const code = customAlphabet('1234567890',5)
    const newcode = code()
    
    const data = {
      email:email,
      Verificationcode:newcode
    }
    // storing in the db
    const model = new verificationCode(data)
    await model.save()

    // sending the mail
    const user_email = process.env.EMAIL_USER
    const user_pass = process.env.EMAIL_PASS
    
    await sendEmail(email,newcode,user_email,user_pass);

    return res.status(201).json({
      message:"Registered",
      data:savedata,
      success:true
    })
  }catch(err){
    return res.status(501).json({
      message:err.message|| err,
      err:true
    })
  }
}

export default register;
