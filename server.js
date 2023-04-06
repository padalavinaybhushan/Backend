

const express = require("express");
const path = require("path");
const exp = require("constants");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandlers");
const dotenv = require("dotenv").config();
//const staticPath = require('path').join(__dirname,"../public");
//app.use(express.static(staticPath))

connectDb();
const app = express();

app.use("/uploads",express.static('uploads'))
app.use(express.static(path.join(__dirname,"../Frontend/views")));
let cors = require('cors')
app.use(cors())
console.log(path.join(__dirname,"../Frontend/views"));

const io = require('./routes/socket')
app.use(express.json())
app.use(errorHandler)

app.get("/",(req,res)=>{
    console.log("server");
    res.json({s:"iko"})
})

app.use("",require("./routes/route"));


const server = app.listen(8002,()=>{
    console.log("listening on http://localhost:8002");
})

module.exports = {server}