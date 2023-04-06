const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    
    canId:{
        type:mongoose.Schema.Types.ObjectId
    },
    jobId:{
        type:mongoose.Schema.Types.ObjectId
    },
    resume:{
        type:String 
    }
  },
  { timestamps : true }
);

module.exports = mongoose.model("ResumeDB", schema);

