const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
        name:{
            type:String,
            required:true 
        },
        jobDescription:{
            type:String
        },
        location:{
            type:String
        },
        Experience:{
            type:Number
        },
        createrId : {
            type:mongoose.Schema.Types.ObjectId,
            required :true 
        },
        maxApplication :{
            type:Number
        },
        maxPosition :{
            type:Number
        },
        skills : [String],
        salary:{
            type:Number
        },
        applied:[mongoose.Schema.Types.ObjectId],
        accepted : [mongoose.Schema.Types.ObjectId],
        rejected : [mongoose.Schema.Types.ObjectId]

  },
  { timestamps : true }
);

module.exports = mongoose.model("Job", schema);

