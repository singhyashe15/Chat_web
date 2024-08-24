const { ConversationModel } = require("../models/conversation")

const getConversation = async(currentUserId)=>{
    console.log(currentUserId)
    if(currentUserId){
        const currentUserConversation = await ConversationModel.findOne({
            "$or" : [
                { sender : currentUserId },
                { receiver : currentUserId}
            ]
        }).sort({  updatedAt : -1 }).populate('messages').populate('sender').populate('receiver')
        console.log((currentUserConversation))
        const conversation = currentUserConversation.messages.map((conv)=>{
            // const countUnseenMsg = conv.reduce((preve,curr) => {
            //     const msgByUserId = curr?.msgUserId?.toString()

            //     if(msgByUserId !== currentUserId){
            //         return  preve + (curr?.seen ? 0 : 1)
            //     }else{
            //         return preve
            //     }
             
            // },0)
            console.log(conv)
            return{
                _id : conv?._id,
                sender : conv?.sender,
                receiver : conv?.receiver,
                // unseenMsg : countUnseenMsg,
                lastMsg : conv.messages[conv?.messages?.length - 1]
            }
        })

        return conversation
    }else{
        return []
    }
}

module.exports = getConversation