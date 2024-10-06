import UserModel from '../models/user.js';

const Verify = async (req,res)=>{
  try {
    const email = req.body
    // checking whether the email exist or not
    const verify = await UserModel.findOne({email:email})
    
  
    if(!verify){
      res.status(401).json({
        'message':"Not Found",
        'success':false
      })
    }
  
    res.status(201).json({
      'message':"Email Verified",
      'success':true
    })
  } catch (error) {
    res.status(501).json({
      'message':error,
      'error':true
    })
  }
}

export default Verify;