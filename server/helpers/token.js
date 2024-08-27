const jwt = require("jsonwebtoken");
const User = require("../models/user");

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

module.exports = gettoken;