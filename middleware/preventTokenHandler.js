//used to validate the token 
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const preventToken = asyncHandler(async (req,res,next)=>{
    let token;
    console.log(req.headers);
    let authHeader = req.headers.authorization || req.headers.Authorization;
    console.log(token,98);
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
        console.log(token,78);
        jwt.verify(token,process.env.ACCESS_TOKEN_SECERT,(err,decoded)=>{
            console.log(err);
            if(err){
                console.log("inside next");
                next();
            }
            else{
                console.log("after next");
                res.status(403);
                throw new Error("User is not authorized")
            }
            
        })
    }
   
    if(!token){
        console.log("lo");
        next();
    }

});

module.exports = preventToken;