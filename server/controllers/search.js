import UserModel from "../models/user.js";

const Search = async(req,res)=>{
  try{
    const {search} = req.body;
    const query = new RegExp(search,"i");

    const user = await UserModel.find({
      "$or" : [
        {name : query}, //user will either provide name or emailid..
        {email : query}
      ]
    }).select("-password"); //exclude password
    if(!user){
      res.status(400).json({
        message:"User not Found",
        data:"",
        success:false
      })
    }
    return res.status(201).json({
      message:"All User details",
      data : user,
      success : true
    })
  }catch(err){
    return res.status(501).json({
      message : err.message || err,
      err : true
    })
  }
}

export default Search