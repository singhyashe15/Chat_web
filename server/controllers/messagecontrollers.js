const {Messagemodel,ConversationModel}  = require( "../models/conversation");
const  { getreceiverid,io }  = require( "../socket/socket");

const  handleSendMessage = async( req,res) =>{
  try{
      const message = {
        text: req.body.text,
        imageUrl : req.body.imageUrl,
        videoUrl:req.body.videoUrl
      }

      const {id : receiverid} = req.params
      const senderId = req.body._id;
      console.log(receiverid)
      let conversation = await ConversationModel.findOne({
        "$or" : [
          {sender : senderId , receiver : receiverid},
          {receiver : receiverid , receiver : senderId}
        ]
      })
      
      if (!conversation) {
        try {
            const conversationMsg = new ConversationModel({
                sender: senderId,
                receiver: receiverid  // using camelCase
            });
            conversation = await conversationMsg.save();
            
        } catch (error) {
            console.error("Error saving conversation:", error);
        }
    }
      const newmsg = new Messagemodel({
        text : message.text,
        imageUrl : message.imageUrl,
        videoUrl : message.videoUrl,
        seen : false,
        msgUserId : senderId
      })
      await newmsg.save();
      if(newmsg){
        const updatemsg = await ConversationModel.updateOne({
          _id:conversation?._id
          },{
          "$push" :{messages : newmsg?._id}
          })
      }
      
      const receiversocket_id = getreceiverid(receiverid);
      console.log("sid" + receiversocket_id)
      if(receiversocket_id){
        io.to(receiversocket_id).emit("new-msg",newmsg)
      }

      res.status(201).json(newmsg)

  }catch(err){
    res.status(500).json(err)
  }
}


const getMessage =async (req,res)=>{
  try{
    const { id  : userchatId} = req.params;
    const senderid = req.body._id;
    
    const conversation = await ConversationModel.findOne({
      "$or" : [
          {sender : senderid , receiver : userchatId},
          {receiver : userchatId , receiver : senderid}
        ]
    })

    if(!conversation){
      return res.json(201).json([])
    }

    const message = conversation.messages
    res.json(201).json(message)
  }catch(err){
    res.status(501).json({error : "Internal Server Error"})
  }
} 

module.exports = {handleSendMessage,getMessage}
