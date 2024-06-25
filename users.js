const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/letNew');

let userSchema=mongoose.Schema({
  username:String,
  email:String,
  password:String,
  name:String,
  pincode:String,
  profilePic:{
    type:String,
    default:"avtar.jpg"
  }
});

module.exports=mongoose.model("user",userSchema);