const asyncHandler = require("express-async-handler")

const express = require("express");
const app = express();
const router = express.Router();
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

const jwt = require("jsonwebtoken");
const usedToken = require("../models/usedToken")
const validateToken = require("../middleware/validateTokenHandlerR");
const preventToken = require("../middleware/preventTokenHandlerR");
const upload = require('../middleware/upload');
const crypto = require('crypto')
const  { uploadFile} = require('../middleware/s3')


const Recruiter = require("../models/requiter")
const Job =require("../models/job");
const job = require("../models/job");
const Employee = require('../models/employee')


const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

const getEmp = asyncHandler(async (req,res)=>{
    var obj = await Recruiter.findOne({_id:req.headers._id})
    res.json(obj);
})

const getelogin = asyncHandler(async (req,res)=>{
    console.log("q");
    res.send("elogin")
})

const postelogin = asyncHandler(async (req,res)=>{
    const obj = await Recruiter.findOne({email:req.body.email,password:req.body.password})
    if(obj){
 const accessToken = jwt.sign({
        user:{
            username:req.body.username,
            email:req.body.email
        }
    },process.env.ACCESS_TOKEN_SECERT1,{expiresIn:"15m"})
    res.json({"user":obj,"accessToken":accessToken});
    }
    else{
        res.json({"noUser":true})
    }
    

})

const getbrowsecandidate = asyncHandler(async (req,res)=>{
    console.log("browse-job-for candidates");
    res.render("browsecandidate.ejs")
})

const getcompanies = asyncHandler(async (req,res)=>{
    console.log("companies for candidates");
    res.render("browse-candidates.ejs")
})

const geterigister = asyncHandler(async (req,res)=>{
    res.send("good");
})

const posterigister = asyncHandler(async (req,res)=>{
    console.log(req.body);
    const new_obj = await Recruiter.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        type:"recuiter",
        company_name:req.body.company
    })
    res.send("created successfull");
    
})

const getempprofile = asyncHandler(async (req,res)=>{
    const jobs = await Job.find({createrId : req.headers.rec_id});
    console.log(jobs);
    console.log(typeof(jobs));
    var jobs_json={}
    let count=0;
    jobs.forEach(ele=>{
        jobs_json[count++]=ele
    })
    res.json(jobs_json);
})

const postpostjob = asyncHandler(async (req,res)=>{
    console.log(req.body);
    var arr= req.body.skills.split(",")
    const new_obj = await Job.create({
        name:req.body.name,
        jobDescription:req.body.jobDescription,
        location:req.body.location,
        Experience:req.body.Experience,
        createrId:req.body.createrId,
        maxApplication:100,
        maxPosition:70,
        skills:arr,
        salary:req.body.salary     
    })
    res.send("successfully created")
})

const getpostjob = asyncHandler(async (req,res)=>{
    console.log("1");
    res.json({"1":1})
})
const getrecedit = asyncHandler(async (req,res)=>{
    res.json({})
})

const postrecUpdate = asyncHandler(async (req,res)=>{
    console.log(req.body,"polkjj");
    await Recruiter.updateOne({email:req.body.email},{$set :{name:req.body.name}})
   // await Recruiter.updateOne({email:req.body.email},{$set:{password:req.body.password}})
   await Recruiter.updateOne({email:req.body.email},{$set :{phone1:req.body.phone1}})
   await Recruiter.updateOne({email:req.body.email},{$set :{phone2:req.body.phone2}})
   await Recruiter.updateOne({email:req.body.email},{$set :{address:req.body.address}})
   await Recruiter.updateOne({email:req.body.email},{$set :{designation:req.body.designation}})
   await Recruiter.updateOne({email:req.body.email},{$set :{company_name:req.body.company}})
   await Recruiter.updateOne({email:req.body.email},{$set :{github:req.body.github}})
   await Recruiter.updateOne({email:req.body.email},{$set :{linkedin:req.body.linkedin}})

    console.log(await Recruiter.findOne({email:req.body.email}));
    res.json(await Recruiter.findOne({email:req.body.email}))
})

const postrecUpdateProfile = asyncHandler(async (req,res)=>{
    if(req.file){
        var file = req.file
        var imageName = generateFileName()
        const tem = await uploadFile(file.buffer, imageName, file.mimetype)
        imageName = 'https://jobportaluploads.s3.ap-southeast-2.amazonaws.com/' + imageName
        await Recruiter.updateOne({email:req.body.email},{$set :{profile:imageName}}) 
        console.log("bhushan");
        console.log(await Recruiter.findOne({email:req.body.email}),imageName);
    }
    res.send()
})

const getjobdataapplied = asyncHandler(async (req,res)=>{
    var job_arr = await job.findOne({_id:req.headers._id})
    console.log(req.headers._id);
    console.log(job_arr,12);
    var jobs_json={}
    let count=0;
    for(let ele of job_arr.applied){
            jobs_json[count++]= await Employee.findOne({_id:ele});
    }
    res.json(jobs_json);
})

const getbrowsecandidates = asyncHandler(async (req,res)=>{
    res.json({"ok":"success"})
})

const getcandDetail = asyncHandler(async (req,res)=>{
    var obj = await Employee.findOne({_id:req.headers.id})
    console.log(obj);
    res.send(obj)
})

const postjobOffered = asyncHandler(async (req,res)=>{
    var cand_id = req.body.cand_id
    var job_id = req.body.job_id
    console.log(req.body);
    var candobj = await Employee.findOne({_id:cand_id})
    candobj.status[job_id]=4
    await Employee.replaceOne({_id:cand_id},candobj);
    var job_obj = await job.findOne({_id:job_id})
    if(!job_obj.accepted.includes(cand_id)) job_obj.accepted.push(cand_id)
    if(job_obj.rejected.includes(cand_id))  {
        job_obj.rejected = job_obj.rejected.filter(item => item != cand_id)
    }
    await job.updateOne({_id:job_id},{$set:{accepted:job_obj.accepted}})
    await job.updateOne({_id:job_id},{$set:{rejected:job_obj.rejected}})
    console.log(await job.findOne({_id:job_id}));
    res.json({"ok":"success"})
})

const postjobRejected = asyncHandler(async (req,res)=>{
    var cand_id = req.body.cand_id
    var job_id = req.body.job_id
    var job_obj = await job.findOne({_id:job_id})
    if(!job_obj.rejected.includes(cand_id)) job_obj.rejected.push(cand_id)
    if(job_obj.accepted.includes(cand_id))  {
        job_obj.accepted = job_obj.accepted.filter(item => item != cand_id)
    }
    var candobj = await Employee.findOne({_id:cand_id})
    candobj.status[job_id]=0
    await Employee.replaceOne({_id:cand_id},candobj);
    await job.updateOne({_id:job_id},{$set:{accepted:job_obj.accepted}})
    await job.updateOne({_id:job_id},{$set:{rejected:job_obj.rejected}})
    //console.log();
    res.json({"ok":"success"})
})

const getjobdataId = asyncHandler(async (req,res)=>{
    const obj = await job.findOne({_id:req.headers._id})
    return res.json(obj)
})

module.exports = {getEmp,getelogin,postelogin,getbrowsecandidate,getcompanies,
    geterigister,posterigister,getempprofile,postpostjob,
    getrecedit,postrecUpdate,postrecUpdateProfile,getjobdataapplied,
    getbrowsecandidates,getcandDetail,postjobOffered,postjobRejected,
    getjobdataId,getpostjob}