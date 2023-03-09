const mongoose = require('mongoose');

mongoose.set("strictQuery", true);

const connection = async (db_name) =>{
    try{
        const connect = await mongoose.connect(`mongodb://localhost:27017/${db_name}`, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("Connection Successful");
    }catch(err){
        console.log(`Error : ${err}`);
    }
}

connection("employee_db");