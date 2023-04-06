const mongoose = require("mongoose");

let schema = new mongoose.Schema({
    conversationid:{
        type:String
    },
    senderid:{
        type:String
    },
    message:{
        type:String
    },
    
},{timestamps:true})

module.exports = mongoose.model("messages", schema);
