const mongoose = require("mongoose");
const dbURL = `${process.env.DATABASE_LOCAL_URL}/${process.env.DB_NAME}`
console.log("dbURl+++++++",dbURL);

const connectDB = async() =>{
    try{
        const conn = await mongoose.connect(dbURL)
        console.info(`DB Connected:${conn.connection.host}`)

    }catch(error){
        console.log(error);
        process.exit(1);
        
    }
}
module.exports = connectDB;


