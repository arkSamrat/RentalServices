const mongoose=require('mongoose');

let userBikes=mongoose.Schema({
    blocation:String,
    bbrand:String,
    brent:String,
    bimage:{
        type:String
    },
    name:String,
    contact:String
})

module.exports=mongoose.model("busers",userBikes);