const asyncHandler = require("express-async-handler")

const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const fs = require("fs");

const jwt = require("jsonwebtoken");
const usedToken = require("../models/usedToken")
const validateToken = require("../middleware/validateTokenHandlerR");
const preventToken = require("../middleware/preventTokenHandlerR");
const upload = require('../middleware/upload');
const Recruiter = require("../models/requiter")
const Job =require("../models/job");
const job = require("../models/job");
const Employee = require('../models/employee')
const conversations = require('../models/conversations')
const messages = require('../models/messages');

router.post("/conversations",async(req,res)=>{
    var con=await conversations.findOne({ids:{$all:req.body.ids}})
    if(!con)var con=await conversations.findOne({ids:{$all:req.body.ids.reverse}})
    if(!con)await conversations.create({ids:req.body.ids})
    var con=await conversations.findOne({ids:{$all:req.body.ids}})
    if(!con)var con=await conversations.findOne({ids:{$all:req.body.ids.reverse}})
    res.send(con._id)
})

router.post("/messages",async(req,res)=>{
    await messages.create({conversationid:req.body.conversationid,
        senderid:req.body.senderid,
        message:req.body.message})
    res.send("done")
})
router.get("/conversations",async(req,res)=>{
    var items=await conversations.find({ids:{$in:req.headers.id}})
    usernames=[]
    for (conversation of items){
        if(conversation.ids[0]===req.headers.id){
            if(req.headers.type=="recuiter"){
                usernames.push(await Employee.findOne({_id:conversation.ids[1]}))
            }
            else {
                usernames.push(await Recruiter.findOne({_id:conversation.ids[1]}))
            }
        }
        else{
            if(req.headers.type=="recuiter"){
                usernames.push(await Employee.findOne({_id:conversation.ids[0]}))
            }
            else {
                usernames.push(await Recruiter.findOne({_id:conversation.ids[0]}))
            }
        }
    }
    console.log(usernames)
    res.send(usernames)

})


router.get("/messages",async(req,res)=>{
    arr=req.headers.members.split(",")
    var con=await conversations.findOne({ids:{$all:arr}})
    if(!con)var con=await conversations.findOne({ids:{$all:arr.reverse}})
    var data=await messages.find({conversationid:con._id})
    ans=[data]
    if(req.headers.type==="recuiter"){
        if(arr[0]==req.headers.id){
            var username=await Employee.findOne({_id:arr[1]})
        }
        else{
            var username=await Employee.findOne({_id:arr[0]})
        }

    }
    else{
        if(arr[0]==req.headers.id){
            var username=await Recruiter.findOne({_id:arr[1]})
        }
        else{
            var username=await Recruiter.findOne({_id:arr[0]})
        }
    }
    ans.push(username)
    ans.push(con._id)
    res.send(ans)
})
router.get("/sendm",async(req,res)=>{
    res.send(await messages.find({conversationid:req.headers.conversationid}))
})
module.exports = router;
