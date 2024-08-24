const jwt = require("jsonwebtoken");
const User = require("../models/user");

const gettoken = async(token)=>{
  if(!token){
    return {
      message:"session Out",
      logout:true,
    }
  }
  const secretkey = "7a9e6f8c4b2d1c3f5a7b6e9f0d1e4a5c"
  const get = jwt.verify(token,secretkey)
  const user = await User.findById(get.id).select("-password");
  return user
}

module.exports = gettoken;