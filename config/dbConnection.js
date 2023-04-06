const mongoose = require("mongoose");

const connectDb = async() =>{
    try{
       // const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        const connect = await mongoose.connect('mongodb+srv://batch6:herovired@cluster0.aqifkg2.mongodb.net/lms',{ useNewUrlParser: true });

        console.log("database connected: ",connect.connection.host);
       // console.log(connect.connections);

    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDb;