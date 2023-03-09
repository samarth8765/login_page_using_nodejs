const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const path = require('path');
const hbs = require('hbs');
const validator = require("validator");
const bcrypt = require('bcryptjs');

// Database connection
require("./db/connection");

// Register model(collection)
const Register = require("../src/models/registration");

// middleware for collecting data from html form
app.use(express .urlencoded({ extended: true }));

// accessing public folder
const static_path = path.join(__dirname,"../public");
app.use(express.static(static_path));

// accessing dynamic files (templates, views and partials)
const templatePath = path.join(__dirname, '../templates/views')
app.set('view engine','hbs');
app.set('views', templatePath);


// telling express of hbs partials
const partialPath = __dirname + '../templates/partials';
hbs.registerPartials(partialPath);


// root 
app.get('/', (req,res)=>{
    res.render("index");
}); 

// login route
app.get('/login',(req,res)=>{
    res.render("login");
});

// register route
app.get('/register', (req,res)=>{
    res.render("register");
})

// creating a post method for storing employees data
app.post('/register',async (req,res)=>{
    try{
        //collecting data form form
        const fname = req.body.fname;
        const lname = req.body.lname;
        const email = req.body.email;
        const gender = req.body.gender;
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        const age = req.body.age;

        // checking if all fields in form are filled
        if(!fname && !lname && !email && !gender && !password && !cpassword && !age){
            return res.render("go_back",{error: "One or more field's in form is missing",reference:"/register"});
        }

        //validating email 
        if(!validator.isEmail(email)){
            return res.render("go_back",{error:"Please enter correct email",reference:"/register"});
        }
        
        // checking if password and confirm password are equal
        if(password !== cpassword) return res.render("go_back",{error:"Password doesn't Match",reference:"/register"});

        // hashing password
        // bcrypt.hash() takes two arguments 
        // first -> password(string)
        // second -> number of rounds for hashing the password. High number of rounds (difficult to crack password)
        const hashPassword = await bcrypt.hash(password, 10);

        // storing data in database
        const user = new Register({
            first_name: fname,
            last_name: lname,
            email: email,
            gender: gender,
            age: age,
            password: hashPassword
        });

        const data = await user.save();


        res.status(201).send("Your data has been created successfully.");
        
    }
    catch(err){
        res.status(404).send(`Error Found ${err}`);
    }

});

//creating a login request
app.post('/login',async(req,res)=>{
    try{
        // collecting data from login form
        const email = req.body.email;
        const password = req.body.password;
        
        // finding email in database
        const login = await Register.findOne({email});
        
        // validating email
        if(!validator.isEmail(email)) return res.send("Invalid Email");
        
        // checking if password field is empty or not 
        if(!password) return res.send("Please first enter the password");

        // comparing password via hashing
        const correctPassword = await bcrypt.compare(password, login.password);
        if(correctPassword){
            console.log("Successful login");
            res.render('index');
        }else{
            res.render('go_back',{error:'Password is wrong',reference:"/login"});
        }

    }
    catch(err){
        res.send(`Error -> ${err}`);
    }
}); 

// listening at PORT
app.listen(PORT, () =>{
    console.log(`Server is running at port ${PORT}`);
});