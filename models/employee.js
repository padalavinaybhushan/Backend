const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// require("mongoose-type-email");
var findOrCreate = require('mongoose-findorcreate')

let schema = new mongoose.Schema(
  {
    name :{
      type:String
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
    phone1: {type:Number},
    phone2 : {type:Number},
    address:{type:String},
    designation:{type:String},
    github:{type:String},
    linkedin:{type:String},
    campany_name:{type:String},
    skillset : {type:Object},
    courses : [mongoose.Schema.Types.ObjectId],
    profile :{type:String},
    resume:{type:String},
    status:{type:Object},
    googleId:{type:String}
  },
  { timestamps:true }
);
schema.plugin(findOrCreate)
// // Password hashing
// schema.pre("save", function (next) {
//   let user = this;

//   // if the data is not modified
//   if (!user.isModified("password")) {
//     return next();
//   }

//   bcrypt.hash(user.password, 10, (err, hash) => {
//     if (err) {
//       return next(err);
//     }
//     user.password = hash;
//     next();
//   });
// });

// // Password verification upon login
// schema.methods.login = function (password) {
//   let user = this;

//   return new Promise((resolve, reject) => {
//     bcrypt.compare(password, user.password, (err, result) => {
//       if (err) {
//         reject(err);
//       }
//       if (result) {
//         resolve();
//       } else {
//         reject();
//       }
//     });
//   });
// };

module.exports = mongoose.model("Employee", schema);
