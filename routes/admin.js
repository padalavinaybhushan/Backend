

const asyncHandler = require("express-async-handler")

const express = require("express");
const app = express();
const router = express.Router();
const ejs = require("ejs");
const path = require("path");


//middlewares
const jwt = require("jsonwebtoken");
const validateToken = require("../middleware/validateTokenHandler");
const preventToken = require("../middleware/preventTokenHandler");
const upload = require('../middleware/upload');


//models
const Employee = require("../models/employee");
const job = require("../models/job");
const Recuiter = require('../models/requiter');
const Test = require("../models/testQuestion");
const ResumeDB = require('../models/resumeDB')

router.get('/admin',async(req,res)=>{
    var employeeObj = await Employee.find();
    var recuiterObj = await Recuiter.find();
    var returnObj = {};
    returnObj['employee'] = employeeObj
    returnObj['recuiter'] = recuiterObj
    res.send(returnObj)
})


router.get('/AdmingetEmp',async(req,res)=>{
    var recuiterObj = await Recuiter.findOne({_id:req.headers._id});
    res.send(recuiterObj)
})
router.get('/AdmingetCan',async(req,res)=>{
    var recuiterObj = await Employee.findOne({_id:req.headers._id});
    res.send(recuiterObj)
})

router.get('/edittest',async(req,res)=>{
   res.send(await Test.distinct("name"))
})

router.get('/edittestpage',async(req,res)=>{
    console.log(await Test.find({name:req.headers.testname}));
    res.send(await Test.find({name:req.headers.testname}))
})

router.post('/delquestion',async (req,res)=>{
  await Test.deleteOne({_id:req.body.id})  
  res.send()
})

router.post('/test/:name',async (req,res)=>{
    Test.create({
        name:req.params.name,
        ans:req.body.ans,
        options:req.body.options ,
        que_no:1,
        que_str:req.body.question
    })
    res.send()
})
module.exports = router;