import mongoose from 'mongoose'


const Verification = new mongoose.Schema({
  email:{
    type:String,
    required:[true,"provide email"]
  },
  Verificationcode:{
    type:Number,
    required:true
  }
},{
  timestamps:true 
})

const verificationCode = mongoose.model('verification',Verification)

export default verificationCode;