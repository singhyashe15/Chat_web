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
        console.log(("curr" + currentUserConversation))
        // let prev = 0;
        // const conversation = currentUserConversation?.map((conv)=>{
        //     const countUnseenMsg = conv?.messages?.reduce((prev,curr) => {
        //         const msgByUserId = curr?.msgUserId?.toString()

        //         if(msgByUserId !== currentUserId){    
        //             return prev + (curr?.seen.toLowerCse() == 'true' ? 0 : 1)
        //         }else{
        //             return prev
        //         }
             
        //     },0)
        //     // console.log(conv)
        //     return{
        //         _id : conv?._id,
        //         sender : conv?.sender,
        //         receiver : conv?.receiver,
        //         // unseenMsg : countUnseenMsg,
        //         lastMsg : conv.messages[conv?.messages?.length - 1]
        //     }
        //     console.log("msg" + prev)
        // })

        // return conversation
    }else{
        return []
    }
}

module.exports = getConversation