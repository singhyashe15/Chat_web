const {Messagemodel} = require("../models/conversation");

const Deletemsg = async(req,res)=>{
 try {
   const {texts}  = req.body
   console.log(req.body)
   await Messagemodel.deleteOne({text:texts})
   
   return res.status(201).json({
     message:"Deleted successfully",
     success: true
   })
 } catch (error) {
    return res.status(501).json({
      message:"Some error found",
      success: false
    })
 }
}

module.exports = Deletemsg; 