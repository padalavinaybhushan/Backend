
const {constants} = require("../constants");

const errorHandler = (err,req,res,next)=>{
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch(statusCode)  {
        case constants.NOT_FOUND: res.json({tittle:"NOt Found",message:err.message,stackTrace :err.stack});
        case constants.FORBIDDEN: res.json({tittle:"FORBIDDEN",message:err.message,stackTrace :err.stack});
        case constants.UNAUTHARIZED: res.json({tittle:"UNAUTHARIZED",message:err.message,stackTrace :err.stack});
        case constants.VALIDATION_ERROR: res.json({tittle:"VALIDATION",message:err.message,stackTrace :err.stack});
        case constants.Server_err : res.json({tittle:"SERVER ERROR",message:err.message,stackTrace :err.stack});
        default:
            console.log("no error ,all good");
            break;
    }
    
}

module.exports = errorHandler;