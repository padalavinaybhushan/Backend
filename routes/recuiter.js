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
const {uploadS3 }= require('../middleware/uploadS3')


const Recruiter = require("../models/requiter")
const Job =require("../models/job");
const job = require("../models/job");
const Employee = require('../models/employee')



const recuiterController = require('../controllers/recuiter')

router.get("/recuiter/:name",async (req,res)=>{
    const accessToken = jwt.sign({
        user:{
            userid:req.params.name
        }
    },process.env.ACCESS_TOKEN_SECERT1,{expiresIn:"15m"})
    var empobj = await Recruiter.findOne({_id:req.params.name})
    res.json({"user":empobj,"accessToken":accessToken,"okay":true});

})

router.get("/getEmp",validateToken,recuiterController.getEmp)
router.get("/elogin.html",preventToken,recuiterController.getelogin)

router.post("/elogin.html",recuiterController.postelogin)


router.get("/browsecandidate.html",validateToken,recuiterController.getbrowsecandidate)


router.get("/companies.html",validateToken,recuiterController.getcompanies)


router.get("/erigister.html",preventToken,recuiterController.geterigister)


router.post("/erigister.html",preventToken,recuiterController.posterigister)

router.get("/empprofile.html",validateToken,recuiterController.getempprofile)

router.get("/postjob.html",validateToken,recuiterController.getpostjob)

router.post("/postjob.html",validateToken,recuiterController.postpostjob)

router.get("/recedit.html",validateToken,recuiterController.getrecedit)

router.post("/recUpdate",validateToken,recuiterController.postrecUpdate)

router.post('/recUpdateProfile',uploadS3.single('profile'),recuiterController.postrecUpdateProfile)

router.get('/job-data-applied',validateToken,recuiterController.getjobdataapplied)

router.get('/browse-candidates.html',validateToken,recuiterController.getbrowsecandidates)

router.get('/candDetail',validateToken,recuiterController.getcandDetail)

router.post('/jobOffered',validateToken,recuiterController.postjobOffered)

router.post('/jobRejected',validateToken,recuiterController.postjobRejected)

router.get("/job-dataId",validateToken,recuiterController.getjobdataId)


router.get('/updateJobStatus',validateToken,asyncHandler(async(req,res)=>{
    var candId = req.headers.canid
    var jobId = req.headers.jobid
    var canObj = await Employee.findOne({_id:candId})
    var job_obj = await job.findOne({_id:jobId})
    console.log(canObj);
    console.log("p;akakall");
    if(req.headers.status == 'reject'){
        canObj.status[jobId] = 0 
        
        if(!job_obj.rejected.includes(candId)) job_obj.rejected.push(candId)
        if(job_obj.accepted.includes(candId))  {
            job_obj.accepted = job_obj.accepted.filter(item => item != candId)
        }
        await job.updateOne({_id:jobId},{$set:{accepted:job_obj.accepted}})
        await job.updateOne({_id:jobId},{$set:{rejected:job_obj.rejected}})
       
        await Employee.replaceOne({_id:candId},canObj);
        console.log(await Employee.findOne({_id:candId}));
    }
    else{
        if(!canObj.status){
            var json = {}
            json[jobId]=1
            await Employee.updateOne({_id:candId},{$set :{status:json}})
            //canObj.status = {jobId:2}
        }
        else{
            if(canObj.status[jobId])
                canObj.status[jobId]+=1 
            else 
                canObj.status[jobId]=1
            if(job_obj.rejected.includes(candId))  {
                job_obj.rejected = job_obj.rejected.filter(item => item != candId)
            }
            if(job_obj.accepted.includes(candId))  {
                job_obj.accepted = job_obj.accepted.filter(item => item != candId)
            }
            if(canObj.status[jobId]==4)  {
                job_obj.accepted.push(candId)
            }
            await Employee.replaceOne({_id:candId},canObj);
            await job.updateOne({_id:jobId},{$set:{accepted:job_obj.accepted}})
            await job.updateOne({_id:jobId},{$set:{rejected:job_obj.rejected}})
        }
        
        console.log(await Employee.findOne({_id:candId}));
    }

    
    res.send();
}))
module.exports = router;

/*
getEmp,getelogin,postelogin,getbrowsecandidate,getcompanies,
geterigister,posterigister,getempprofile,postpostjob,
getrecedit,postrecUpdate,postrecUpdateProfile,getjobdataapplied,
getbrowsecandidates,getcandDetail,postjobOffered,postjobRejected,
getjobdataId

*/