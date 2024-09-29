import mongoose from "mongoose";

export const connectDB = async()=>{
  try{
    const url = process.env.MONGODB_URL
    
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

