const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"provide name"]
  },
  email:{
    type:String,
    required:[true,"provide email"],
    unique:true
  },
  password:{
    type:String,
    required:[true,"provide password"]
  },
  profile_pic:{
    type:String,
    default:""
  },
  quotes:{
    type:String,
    default:""
  }
},{
  timestamps:true //to get createdAt and UpdatedAt time record
})

const UserModel = mongoose.model('User',userSchema);
module.exports = UserModel;