import UserModel from "../models/user.js";

const Search = async(req,res)=>{
  try{
    const {search} = req.body;
    const query = new RegExp(search,"i");
 
    const user = await UserModel.find({
        name : query       
    }).select("-password"); //exclude password

    if(user.length === 0){  
     return res.json({
        message:"User not Found",
        data:[],
        success:true
      })
    }
    return res.status(201).json({
      message:"User details",
      data : user,
      success : true
    })
  }catch(err){
    console.log("eer" + err)
    return res.status(501).json({
      message : err.message || err,
      err : true
    })
  }
}

export default Search
