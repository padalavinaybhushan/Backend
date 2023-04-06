const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    
    name: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
    },
    password: {
      type: String,
    },
    type: {
      type: String,
    },
    company_name:{
        type:String,
    },
    phone1: {type:Number},
    phone2 : {type:Number},
    address:{type:String},
    designation:{type:String},
    github:{type:String},
    linkedin:{type:String},
    profile :{type:String},
    googleId:{type:String}
  },
  { timestamps : true }
);

module.exports = mongoose.model("Recruiter", schema);

