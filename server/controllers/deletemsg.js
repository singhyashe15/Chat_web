const {Messagemodel} = require("../models/conversation");

const Deletemsg = async(req,res)=>{
 try {
   const {texts}  = req.body
   const message = await Messagemodel.findOne({text:texts})
   
   await Messagemodel.updateOne({_id:message._id},
    {
      "$set": {text : 'This Message was deleted'}
    }
   )
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