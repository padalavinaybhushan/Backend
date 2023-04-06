const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    }
},
  { timestamps : true }
);

module.exports = mongoose.model("usedToken", schema);

