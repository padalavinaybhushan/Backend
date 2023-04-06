const asyncHandler = require("express-async-handler")
const usedToken = require("../models/usedToken")

const express = require("express");
const app = express();
const router = express.Router();
const ejs = require("ejs");
const path = require("path");
const validateToken = require("../middleware/validateTokenHandler");

app.use(express.static(path.join(__dirname+"../../../Frontend/public")));

app.use("/css",  express.static(__dirname+"../../../Frontend/public" ));
app.use("/js", express.static(__dirname +"../../../Frontend/public"));
app.use("/images", express.static(__dirname +"../../../Frontend/public"));

//models
const Employee = require('../models/employee')
const Recuiter = require('../models/requiter')
const session = require('express-session');

let cors = require('cors')
app.use(cors())

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));




app.get("/",(req,res)=>{
    console.log("route");
    res.json({sucess:"yjj"})
})


app.post("/",(req,res)=>{
    console.log(req.session.use,1,req.body);
    res.render("mainhome")
})

app.get("/logout.html",asyncHandler(async (req,res)=>{
    let token;
    console.log(token,90);
    let authHeader = req.headers.authorization || req.headers.Authorization;
    token = authHeader.split(" ")[1];
    const tokendb = await usedToken.create({
        token
    })
    res.send("destroy");
}))

const passportr = new (require('passport').Passport)();
  app.use(passportr.initialize());
  app.use(passportr.session());
  
  passportr.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
  passportr.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });
  
  const GoogleStrategyr = require('passport-google-oauth').OAuth2Strategy;
  const GOOGLE_CLIENT_IDR = '522437877998-8dosa7nbh5u71arje7ls12osr1tu5maf.apps.googleusercontent.com';
  const GOOGLE_CLIENT_SECRETR = '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';
  passportr.use(new GoogleStrategyr({
      clientID: GOOGLE_CLIENT_IDR,
      clientSecret: GOOGLE_CLIENT_SECRETR,
      callbackURL: "http://localhost:8002/rec/auth/google/Reccallback/"
    },
    async function(accessToken, refreshToken, profile, done) {
        userProfile=profile;
        //console.log(profile);
        if(await Recuiter.findOne({googleId:userProfile.id})){
  
        }
        else{
          Recuiter.create({googleId:userProfile.id,name:userProfile.displayName,email:userProfile._json.email,profile:userProfile._json.picture})
        }
        done(null, userProfile);
    }
  ));
   
  app.get('/rec_auth',passportr.authenticate('google', { scope : ['profile', 'email'] }), (req,res)=>{
      res.send("olll")
  });
   
  app.get('/auth/google/Reccallback/', 
    passportr.authenticate('google', { failureRedirect: '/error' }),
    async function(req, res) {
      console.log(req.user,908);
      var empobj = await Recuiter.findOne({googleId:req.user.id})
      console.log(empobj,708);
      res.redirect(`http://localhost:5503/Frontend/rectemp.html?id=${empobj._id}`);
  
    });
  
  
module.exports = app;