import {ConversationModel} from "../models/conversation.js"

const getConversation = async(currentUserId)=>{
    
    if(currentUserId){
        const currentUserConversation = await ConversationModel.find({
            "$or" : [
                { sender : currentUserId },
                { receiver : currentUserId}
            ]
        }).sort({  updatedAt : -1 }).populate('messages').populate('sender').populate('receiver')
        const conversation = currentUserConversation?.map((conv)=>{
            const countUnseenMsg = conv?.messages?.reduce((prev,curr) => {
                const msgByUserId = curr?.msgUserId?.toString()

                if(msgByUserId !== currentUserId){    
                    let seen = curr?.seen
                    curr = 0
                    if(seen === "false") curr = 1;
                    
                    return prev + curr
                }else{
                    return prev
                }
             
            },0)

            return{
                _id : conv?._id,
                sender : conv?.sender,
                receiver : conv?.receiver,
                msgByUserId:conv?.msgUserId,
                unseenMsg : countUnseenMsg,
                lastMsg : conv.messages[conv?.messages?.length - 1],
                
            }

        })

        return conversation
    }else{
        return []
    }
}

export default getConversation