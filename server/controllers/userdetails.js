import userToken from '../helpers/token.js'
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

export default detail