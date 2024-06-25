const mongoose=require('mongoose');



let userschema=new mongoose.Schema({
    location:String,
    flat:String,
    nfp:String,
    rent:String,
    images:[{
        type:String
    }],
    address:String,
    name:String,
    contact:String
});


module.exports=mongoose.model('rooms',userschema);