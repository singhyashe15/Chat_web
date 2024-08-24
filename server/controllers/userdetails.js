const userToken = require('../helpers/token')
const detail = async (req,res)=>{
  try{
    const token = req.cookies.token || "";
    const user = await userToken(token);
    return res.status(200).json({
      message:"User detail",
      data:user
    })
  }catch(err){
    return res.status(501).json({
      message:"some error is there",
      err:true
    })
  }
}

module.exports = detail