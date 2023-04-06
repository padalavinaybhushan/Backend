const asyncHandler = require("express-async-handler")
const express = require("express");
const app = express();
const router = express.Router();

//middlewares
const jwt = require("jsonwebtoken");
const validateToken = require("../middleware/validateTokenHandler");
const preventToken = require("../middleware/preventTokenHandler");
const upload = require('../middleware/upload');
const crypto = require('crypto')
const  { uploadFile} = require('../middleware/s3')

//models
const Employee = require("../models/employee");
const job = require("../models/job");
const Recuiter = require('../models/requiter');
const Test = require("../models/testQuestion");
const ResumeDB = require('../models/resumeDB')



const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

const getclogin = asyncHandler(async (req,res)=>{
    console.log("inside clogin get");
    res.send("clogin");
})

const postclogin = asyncHandler(async (req,res)=>{
   // const {email,password} = req.body;
   try {
    console.log("plk 890");
    const obj = await Employee.findOne({email:req.body.email,password:req.body.password})
    //console.log(obj,obj.email);
    if(obj){
        const accessToken = jwt.sign({
            user:{
                username:req.body.name,
                email:req.body.email
            }
        },process.env.ACCESS_TOKEN_SECERT,{expiresIn:"15m"})
        console.log(1);
        res.json({"user":obj,"accessToken":accessToken,"okay":true});
    }
    else{
        console.log(2);
        res.json({"noUser":true,"okay":false});
    }
    
   } catch (error) {
    res.send({"ee":error,"njj":"njk"})
   }
 

})

const temproute = asyncHandler(async(req,res)=>{
    console.log("bhuu");
    res.send({"okay":"po"});
})

const postJobdel = asyncHandler(async(req,res)=>{
    var cand_obj = await Employee.findOne({_id:req.body.cand_id})
    var job_obj = await job.findOne({_id:req.body.job_id})
    var cand_arr =  cand_obj.courses;
    cand_obj.status[req.body.job_id]=undefined
    cand_arr =  Array.from(cand_arr).filter(item => item != req.body.job_id)
    var job_arr =  job_obj.applied;
    job_arr =  Array.from(job_arr).filter(item => item != req.body.cand_id)
    job_obj.accepted = Array.from(job_obj.accepted).filter(item => item != req.body.cand_id)
    job_obj.rejected = Array.from(job_obj.rejected).filter(item => item != req.body.cand_id)
    await Employee.updateOne({_id:req.body.cand_id},{$set :{courses:cand_arr}})
    await Employee.updateOne({_id:req.body.cand_id},{$set :{status:cand_obj.status}})
    await job.updateOne({_id:req.body.job_id},{$set :{applied:job_arr}})
    await job.updateOne({_id:req.body.job_id},{$set :{accepted:job_obj.accepted}})
    await job.updateOne({_id:req.body.job_id},{$set :{rejected:job_arr.rejected}})
    res.send({"okay":"success"})
})

const getBrowseJob = asyncHandler(async (req,res)=>{
    const arr = await  Employee.findOne({_id:req.headers.rec_id});
    console.log(arr);
    const jobs = await job.find();
    //console.log(jobs);
    var jobs_json={}
    let count=0;
    for(let ele of jobs){
        if(!( arr.courses).includes(ele._id))
            jobs_json[count++]=ele
    }
    res.json(jobs_json);
})

const getJobData = asyncHandler(async (req,res)=>{
    const jobs = await job.findOne({createdAt:req.headers.time});
    console.log(jobs);
    res.json(jobs);
})

const getJobDetail = asyncHandler(async (req,res)=>{
    var jobobj = await job.findOne({_id:req.headers.jobid})
    var user_status = (await Employee.findOne({_id:req.headers.canid})).status
    console.log("job nio");
    res.send([jobobj,user_status]);
})

const getCedit = asyncHandler(async (req,res)=>{
    res.json({})
})

const postCUpdate = asyncHandler(async (req,res)=>{
    console.log(req.body,900,req.file);
    await Employee.updateOne({email:req.body.email},{$set :{name:req.body.name}})
    
    await Employee.updateOne({email:req.body.email},{$set :{phone1:req.body.phone1}})
    await Employee.updateOne({email:req.body.email},{$set :{phone2:req.body.phone2}})
    await Employee.updateOne({email:req.body.email},{$set :{address:req.body.address}})
    await Employee.updateOne({email:req.body.email},{$set :{designation:req.body.designation}})
    await Employee.updateOne({email:req.body.email},{$set :{company_name:req.body.company}})
    await Employee.updateOne({email:req.body.email},{$set :{github:req.body.github}})
    await Employee.updateOne({email:req.body.email},{$set :{linkedin:req.body.linkedin}})
    
    console.log(await Employee.findOne({email:req.body.email}));
    res.json(await Employee.findOne({email:req.body.email}))
})

const postCUpdateProfile = asyncHandler(async (req,res)=>{
    if(req.file){
        //var dest = 'uploads'+req.file.path.substr(req.file.path.lastIndexOf('/'))
        var file = req.file
        var imageName = generateFileName()
        const tem = await uploadFile(file.buffer, imageName, file.mimetype)
        imageName = 'https://jobportaluploads.s3.ap-southeast-2.amazonaws.com/' + imageName
        await Employee.updateOne({email:req.body.email},{$set :{profile:imageName}})
        res.send()
    }
})

const resume = asyncHandler(async (req,res)=>{
    console.log("resume inside");
    if(req.file){
        var file = req.file
        var imageName = generateFileName()
        const tem = await uploadFile(file.buffer, imageName, file.mimetype)
        imageName = 'https://jobportaluploads.s3.ap-southeast-2.amazonaws.com/' + imageName
        //var dest = 'uploads'+req.file.path.substr(req.file.path.lastIndexOf('/'))
        await Employee.updateOne({email:req.body.email},{$set :{resume:imageName}}) 
        console.log(await Employee.findOne({email:req.body.email}) );
       
    }
    res.send()
})

const postresumeDB = asyncHandler(async(req,res)=>{
    console.log(req.body,"jkkk");
    if(req.file){
        var file = req.file
        var imageName = generateFileName()
        const tem = await uploadFile(file.buffer, imageName, file.mimetype)
        imageName = 'https://jobportaluploads.s3.ap-southeast-2.amazonaws.com/' + imageName
       // var dest = 'uploads'+req.file.path.substr(req.file.path.lastIndexOf('/'))
        if(req.body.canId){
            await ResumeDB.create({
                canId:req.body.canId,
                jobId:req.body.jobId,
                resume : imageName
            })
        }
        else{
            await ResumeDB.create({
                canId:req.body.canid,
                jobId:req.body.jobid,
                resume : imageName
            })
        }
        
        res.send()
    }
})

const getresumeDB = asyncHandler(async(req,res)=>{
    console.log(req.headers);
    if(req.headers.canid){
        var obj = await ResumeDB.findOne({canId:req.headers.canid,jobId:req.headers.jobid})
    var user_status = (await Employee.findOne({_id:req.headers.canid})).status
    console.log(obj,user_status,1);
    if(obj) {
        res.send([obj.resume,user_status])
    }
    else {
        res.send([obj,user_status])
    }
    }
    else{
        var obj = await ResumeDB.findOne({canId:req.headers.canId,jobId:req.headers.jobId})
    var user_status = (await Employee.findOne({_id:req.headers.canId})).status
    console.log(obj,user_status);
    if(obj) {
        res.send([obj.resume,user_status])
    }
    else {
        res.send([obj,user_status])
    }
    }

})

const postresumeurl = asyncHandler(async (req,res)=>{
        var obj = await Employee.findOne({email:req.body.email}) 
        res.send(obj.resume)
})

const postJobdetail = asyncHandler(async (req,res)=>{
    console.log(req.body);
    var cand_obj = await Employee.findOne({_id:req.body.cand_id});
    cand_obj.courses.push(req.body.course_id)
    
    var job_obj = await job.findOne({_id:req.body.course_id});
    job_obj.applied.push(req.body.cand_id)
    await Employee.replaceOne({_id:req.body.cand_id},cand_obj)
    if(!cand_obj.status){
        var status = {}
        status[job_obj._id]=0
        await Employee.updateOne({_id:req.body.cand_id},{$set :{status:status}})
    }
    else{
        cand_obj.status[job_obj._id]=0
        await Employee.replaceOne({_id:req.body.cand_id},cand_obj)
    }
    
    await job.replaceOne({_id:req.body.course_id},job_obj)
    console.log("job nio");
    res.json({});
})

const getCanprofile = asyncHandler(async (req,res)=>{
    console.log(req.headers.canid,90890);
    res.send(await Employee.findOne({_id:req.headers.canid}))
})

const getCompanies = asyncHandler(async (req,res)=>{
    res.send("companies")
})

const getjobsapplied = asyncHandler(async (req,res)=>{
    const emp_obj = await Employee.findOne({_id:req.headers.rec_id})
    console.log(emp_obj)
    var json_obj = {}
    let count=0
    json_obj["accepted"]=[]
    json_obj["rejected"]=[]
    for(let i of emp_obj.courses){
        var job_obj =  await job.findOne({_id:i})
        json_obj[count++] =job_obj
        if(job_obj.accepted.includes(req.headers.rec_id)) json_obj["accepted"].push(job_obj._id)
        if(job_obj.rejected.includes(req.headers.rec_id)) json_obj["rejected"].push(job_obj._id)
    }
    console.log(json_obj);
    res.json(json_obj)

    
})

const getcrigister = asyncHandler(async (req,res)=>{
    res.send("candidate registration");
})

const postcrigister = asyncHandler(async (req,res)=>{
   // const {name,email1,password1} = req.body;
    const new_obj = await Employee.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        type:"employee"
    })
    res.send("created successfull");
    
})

const posttest = asyncHandler(async(req,res)=>{
    const new_obj = await Test.create({
        name:req.body.name,
        que_no:req.body.que_no ,
        que_str : req.body.que_str,
        options:req.body.options,
        ans:req.body.ans 
    })
    res.send("created successfull");
})

const gettesthtml = asyncHandler(async(req,res)=>{
     const tem_obj = await Test.find({name:req.headers.name})
    console.log(tem_obj);
    res.send(tem_obj)
})

const gettest = asyncHandler(async(req,res)=>{
    console.log(req.headers);
    const tem_obj1 = await Test.find({name:req.headers.name})
    console.log("test1");
    console.log(tem_obj1);
    res.send(tem_obj1)
})

const postscoreUpdate = asyncHandler(async(req,res)=>{
    console.log(req.body);
    var cand_obj = await Employee.findOne({_id:req.body.cand_id});
    var new_score=0
    for(let test_id in req.body.ans){
        console.log(((await Test.findOne({_id:test_id})).ans),req.body.ans[test_id]);
        if(((await Test.findOne({_id:test_id})).ans) == req.body.ans[test_id]) new_score++;
    }
    if(!cand_obj.skillset || !cand_obj.skillset[req.body.test_name]){
        var test_name = req.body.test_name;
        if(!cand_obj.skillset) cand_obj.skillset = {}
        cand_obj.skillset[req.body.test_name] = new_score
        await Employee.updateOne({_id:req.body.cand_id},{$set : {skillset:cand_obj.skillset}})
    }
    else if(cand_obj.skillset[req.body.test_name]<new_score){
        cand_obj.skillset[req.body.test_name] = new_score 
        await Employee.updateOne({_id:req.body.cand_id},{$set : {skillset:cand_obj.skillset }})
    }
    res.send("good")
})

const gettestpage = asyncHandler(async(req,res)=>{
     console.log(await Test.distinct("name"));
   //await Test.updateMany({que_no:1},{$set:{"name":"python"}})
    res.send();
})

const gettestpagerender = asyncHandler(async(req,res)=>{
res.send(await Test.distinct("name"));
})


module.exports = {getclogin,postclogin,postJobdel,getBrowseJob,getJobData,getJobDetail,getCedit,postCUpdate,postCUpdateProfile,resume,
postresumeDB,getresumeDB,postresumeurl,postJobdetail,getCanprofile,getCompanies,getjobsapplied,getcrigister,
postcrigister,posttest,gettesthtml,gettest,postscoreUpdate,gettestpage,gettestpagerender,temproute}