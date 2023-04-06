//used to validate the token 
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const usedToken = require("../models/usedToken")

const validateToken = asyncHandler(async (req,res,next)=>{
    let token1;
    console.log(token1,90);
    let authHeader = req.headers.authorization || req.headers.Authorization;
    console.log(req.headers);
    if(authHeader && authHeader.startsWith("Bearer")){
        token1 = authHeader.split(" ")[1];
        console.log(token1);
        jwt.verify(token1,process.env.ACCESS_TOKEN_SECERT1,async (err,decoded)=>{
            if(err){
                res.status(401);
                throw new Error("User is not authorized1");
            }
            const prevToken = await usedToken.findOne({token:token1})
            if(prevToken){
                res.status(401);
                throw new Error("User is not authorized2");
            }
            req.user = decoded.user;
            next();//middleware
        })
    }

    if(!token1){
        res.status(401);
        throw new Error("User is not authorized3")
    }
});

module.exports = validateToken;