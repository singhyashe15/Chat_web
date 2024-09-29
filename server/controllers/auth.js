import verificationCode from '../models/verification.js';

const VerifyEmail = async(req,res)=>{
  const code = req.body;
  console.log(code)
  try {
    const authenticate = await verificationCode.findOne({Verificationcode:code})
    await verificationCode.deleteOne({Verificationcode:code})
   
    if(!authenticate){
      res.status(401).json({
        message:"Check your verification code",
        success:false
      })
    }
  
    res.status(200).json({
      message:"User Verified, Now Proceed",
      success:true
    })
  } catch (error) {
    res.status(401).json({
        message:"Some Error occured",
        error:true
    })
  }
}

export default VerifyEmail