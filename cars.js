const mongoose=require('mongoose');

let userCars=mongoose.Schema({
    clocation:String,
    cbrand:String,
    crent:String,
    cimage:[{
        type:String
    }],
    name:String,
    contact:String
})

module.exports=mongoose.model("cusers",userCars);