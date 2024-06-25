const mongoose=require('mongoose');


let roomSchema =mongoose.Schema({
    location:String,
    room:String,
    nfp:String,
    rent:String,
    address:String,
    images:[
        {
            type:String
        }
    ],
    name:String,
    contact:String
})

module.exports=mongoose.model('pguser',roomSchema);

            