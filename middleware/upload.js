const multer = require('multer')
const path = require('path')


var storage = multer.diskStorage({
    destination: function(req,res,cb){
        console.log(__dirname);
        cb(null,path.join(__dirname,"../uploads"))
    },
    filename:function (req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
})
const upload = multer({ storage:storage,
fileFilter:function(req,file,callback){
    if(
        // file.mimetype == "image/png"||
        // file.mimetype == "image/jpg"
        true
    ){
        callback(null,true)
    }
    else{
        console.log("no uplaos");
        callback(null,false)
    }
    limits:{
        filesize:1024*1024*2 
    }
}
})

module.exports = upload;