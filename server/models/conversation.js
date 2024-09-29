import mongoose from "mongoose"
//
const messageSchema = new mongoose.Schema({
  text:{
    type:String,
    default:""
  },
  imageUrl:{
    type:String,
    default:""
  },
  videoUrl:{
    type:String,
    default:""
  },
  seen:{
    type:String,
    default:false
  },
  msgUserId:{
    type:mongoose.Schema.ObjectId,
    required:true,
    ref:'User'
  },
},{
  timestamps:true
})

const conversationSchema = new mongoose.Schema({
  sender:{
    type:mongoose.Schema.ObjectId,
    required:true,
    ref:'User'
  },
  receiver:{
    type:mongoose.Schema.ObjectId,
    required:true,
    ref:'User'
  },
  messages:[
    {
      type:mongoose.Schema.ObjectId,
      ref:'Message'
    }
  ]
  },
{
  timestamps:true
})

const Messagemodel = mongoose.model('Message',messageSchema);
const ConversationModel = mongoose.model('Conversation',conversationSchema);

export {Messagemodel,ConversationModel}

