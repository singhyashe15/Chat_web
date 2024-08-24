const getDetailfromtoken = require("../helpers/token");
const User = require("../models/user")

const Updatedetail = async(req,res)=>{
  try{
    const token = req.cookies || ""
    const user = await getDetailfromtoken(token);

    const {name,profile_pic} = req.body;
    const update = await User.updateOne({_id:user._id},{name,profile_pic})

    const userInfo = await User.findById(user._id);

    return res.json({
      message:"user updated successfully",
      data:userInfo,
      success:true
    })
  }catch(err){
    return res.status(501).json({
      message:err.message || err,
      err:true
    })
  }
}

module.exports = Updatedetail