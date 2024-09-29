import jwt from "jsonwebtoken";
import User from "../models/user.js";

const gettoken = async(token)=>{
  if(!token){
    return {
      message:"session Out",
      logout:true,
    }
  }
  const secretkey = process.env.JWT_SECRET_KEY
  const get = jwt.verify(token,secretkey)
  const user = await User.findById(get.id).select("-password");
  return user
}
export default gettoken;