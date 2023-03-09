const mongoose = require("mongoose");

const registration = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    password:{
        type:String,
        required: true
    }

});

const Register = new mongoose.model("Employee_Registration",registration);

module.exports = Register;