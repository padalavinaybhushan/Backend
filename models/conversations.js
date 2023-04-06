const mongoose = require("mongoose");

let schema = new mongoose.Schema({
    ids:[String]
},{timestamps:true})

module.exports = mongoose.model("conversations", schema);
