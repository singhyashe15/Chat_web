import UserModel from '../models/user.js';
import bcryptjs from 'bcryptjs'

const ResetPassword = async (req,res)=>{
  try {
    const {email,password} = req.body
  //  hashing the updated passowrd
    const salt = await bcryptjs.genSalt(10);
    const hashPass = await bcryptjs.hash(password,salt);

    // updating the user details
    await UserModel.updateOne({email},{password:hashPass})
    
  
    res.status(201).json({
      'message':"Password Changed",
      'success':true
    })
  } catch (error) {
    res.status(501).json({
      'message':error,
      'error':true
    })
  }
}

export default ResetPassword;