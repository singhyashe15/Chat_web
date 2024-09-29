import getDetailfromtoken from "../helpers/token.js";
import UserModel from "../models/user.js";

const Updatedetail = async(req,res)=>{
  try{
    const token = req.cookies.token || ""

    const user = await getDetailfromtoken(token);

    const {name,profile_pic} = req.body;
    const update = await UserModel.updateOne({_id:user._id},{name,profile_pic})

    const userInfo = await UserModel.findById(user._id);

    return res.json({
      message:"Details updated successfully",
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
export default Updatedetail