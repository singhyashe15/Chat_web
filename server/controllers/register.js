const User = require("../models/user");
const bcryptjs = require("bcryptjs")

const register = async(req,res)=>{
  try{
    const {name,email,password,profile_pic} = req.body;
    const checkEmail = await User.findOne({email});
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
    
    const user = new User(payload); // storing the data
    const savedata = await user.save();

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

module.exports = register;