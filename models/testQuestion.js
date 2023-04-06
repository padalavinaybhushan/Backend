const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    name:{
      type:String
    },
    que_no: {
      type: Number,
      required: true,
    },
    que_str :{
        type:String,
        required:true
    },
    options:[String],
    ans:{
        type:String,
        required:true
    }
    
  },
  { timestamps : true }
);

module.exports = mongoose.model("Test", schema);

