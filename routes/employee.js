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
const {uploadS3 }= require('../middleware/uploadS3')


//models
const Employee = require("../models/employee");
const job = require("../models/job");
const Recuiter = require('../models/requiter');
const Test = require("../models/testQuestion");
const ResumeDB = require('../models/resumeDB')

//controllers 
const employeeController = require('../controllers/employee')



router.get("/vinay/:name",async (req,res)=>{
    const accessToken = jwt.sign({
        user:{
            userid:req.params.name
        }
    },process.env.ACCESS_TOKEN_SECERT,{expiresIn:"15m"})
    var empobj = await Employee.findOne({_id:req.params.name})
    res.json({"user":empobj,"accessToken":accessToken,"okay":true});

})


router.get("/clogin.html",preventToken,employeeController.getclogin)

router.get("/temproute",employeeController.temproute);

router.post("/clogin.html",employeeController.postclogin)

router.post("/job-del",validateToken,employeeController.postJobdel)


router.get("/browse-job.html",validateToken,employeeController.getBrowseJob)

router.get("/job-data",validateToken,employeeController.getJobData)


router.get("/job-detail.html",validateToken,employeeController.getJobDetail)

router.get("/cedit.html",validateToken,employeeController.getCedit)

router.post("/cUpdate",validateToken,employeeController.postCUpdate)

router.post('/cUpdateProfile',uploadS3.single('profile'),employeeController.postCUpdateProfile)

router.post('/resume',uploadS3.single('picture'),employeeController.resume)


router.post('/resumeDB',upload.single('resume'),employeeController.postresumeDB)

router.get('/resumeDB',employeeController.getresumeDB)

router.post('/resumeurl',employeeController.postresumeurl)

router.post("/job-detail.html",validateToken,employeeController.postJobdetail)

router.get("/canprofile.html",validateToken,employeeController.getCanprofile)

router.get("/companies.html",validateToken,employeeController.getCompanies)

router.get("/jobsapplied.html",validateToken,employeeController.getjobsapplied)

// router.get("/companies.html",validateToken,asyncHandler(async (req,res)=>{
//     console.log("companies for candidates");
//     res.render("browse-candidates.ejs")
// }))

router.get("/crigister.html",preventToken,employeeController.getcrigister)


router.post("/crigister.html",preventToken,employeeController.postcrigister)

router.post("/test",employeeController.posttest)

router.get("/test.html",employeeController.gettesthtml)

router.get("/test",employeeController.gettest)

router.post("/scoreUpdate",employeeController.postscoreUpdate)

router.get("/testpage.html",validateToken,employeeController.gettestpage)

router.get("/testpagerender",validateToken,employeeController.gettestpagerender)


module.exports = router;

/*
getclogin,postclogin,postJobdel,getBrowseJob,getJobData,getJobDetail,getCedit,postCUpdate,postCUpdateProfile,resume,
postresumeDB,getresumeDB,postresumeurl,postJobdetail,getCanprofile,getCompanies,getjobsapplied,getcrigister,
postcrigister,posttest,gettesthtml,gettest,postscoreUpdate,gettestpage,gettestpagerender

*/