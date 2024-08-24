const express = require("express");
const {Server} = require("socket.io")
const http = require("http");

const {Messagemodel,ConversationModel} = require("../models/conversation")
const UserModel = require("../models/user")
const getUserDetailsFromToken =  require("../helpers/token")
const app = express();
const server = http.createServer(app)
const io = new Server(server,{
  cors:{
    options:"http://localhost:3000",
    methods:["GET","POST"],
    credentials : true
  }
})

const onlineUser = new Set()

io.on("connection",async(socket) => { //This event listener is triggered whenever a new client connects to the WebSocket server.
  console.log("connect User ", socket.id);

  const token = socket.handshake.auth.token;
  // sender details
  const user = await getUserDetailsFromToken(token)
  //create a room
  socket.join(user?._id?.toString())
  onlineUser.add(user?._id?.toString())
  io.emit('onlineUser',Array.from(onlineUser))
  const u  = new UserModel()
  console.log(u + "oo")
  socket.on('receiver-id',async (ID)=>{
    console.log("idr" + ID)
      const User = await UserModel.findById(ID).select('-password')
      const payload = {
        id:User?._id,
        name:User?.name,
        email:User?.email,
        imageUrl : User?.profile_pic,
        online:onlineUser.has(ID)
      }
      console.log("payload" + JSON.stringify(payload))
      socket.emit('receiver-data',payload)

         //get previous message
         const getConversationMessage = await ConversationModel.findOne({
            "$or" : [
                { sender : user?._id, receiver : ID },
                { sender : ID, receiver :  user?._id}
            ]
        }).populate('messages').sort({ updatedAt : -1 })

        socket.emit('new-msg',getConversationMessage?.messages || [])
    })


    //new message
    socket.on('new message',async(data)=>{

        //check conversation is available both user

        let conversation = await ConversationModel.findOne({
            "$or" : [
                { sender : data?.sender, receiver : data?.receiver },
                { sender : data?.receiver, receiver :  data?.sender}
            ]
        })

        //if conversation is not available
        if(!conversation){
            const createConversation = await ConversationModel({
                sender : data?.sender,
                receiver : data?.receiver
            })
            conversation = await createConversation.save()
        }
     
        const message = new Messagemodel({
          text : data?.text,
          imageUrl : data?.imageUrl,
          videoUrl : data?.videoUrl,
          msgUserId :  data?.msgByUserId,
        })
        const saveMessage = await message.save()

        const updateConversation = await ConversationModel.updateOne({ _id : conversation?._id },{
            "$push" : { messages : saveMessage?._id }
        })

        const getConversationMessage = await ConversationModel.findOne({
            "$or" : [
                { sender : data?.sender, receiver : data?.receiver },
                { sender : data?.receiver, receiver :  data?.sender}
            ]
        }).populate('messages').sort({ updatedAt : -1 })


        io.to(data?.sender).emit('new-msg',getConversationMessage?.messages || [])
        io.to(data?.receiver).emit('new-msg',getConversationMessage?.messages || [])

        //send conversation
        // const conversationSender = await getConversation(data?.sender)
        // const conversationReceiver = await getConversation(data?.receiver)

        // io.to(data?.sender).emit('conversation',conversationSender)
        // io.to(data?.receiver).emit('conversation',conversationReceiver)
    })
  socket.on('disconnect',()=>{
    console.log("Disconnected user" + socket.id)
    // delete onlineUser(user?._id?.toString())
    io.emit('onlineUser',Array.from(onlineUser));
  })
  
})



module.exports ={
  app,server
}
