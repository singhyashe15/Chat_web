const mongoose = require("mongoose");

const connect = async()=>{
  try{
    const url = "mongodb://localhost:27017/chatApp"
    await mongoose.connect(url)
    // const connection = mongoose.connection;
    // connection.on('connected',()=>{
    //     console.log('Connected')
    // })
    // connection.on('error',(err)=>{
    //   console.log("Error "+err)
    // })
    console.log("Connected")
  }catch(err){
    console.log("not connected" + err)
  }
}

module.exports = connect;