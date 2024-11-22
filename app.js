const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('./models/user.model');
const cookieParser = require('cookie-parser');

require('./config/db.config');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(cookieParser());

app.get('/Login', (req, res) => {
    res.render("login");
});

app.get('/login', (req, res) => {
    res.send("loggedIn");
});

app.get('/signup', (req, res) => {
    res.render("signup");
});

app.post("/signup",(req,res)=>{
    let {username, email, password} = req.body;

    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(password,salt, async function(err,hash){
            await userModel.create({
                username,
                email,
                password: hash
            })

            let token = jwt.sign({email}, "Key");
            res.cookie("token", token);
            res.send("Created....")
        })
    })
});

app.post("/login",async (req,res)=>{
    const {username, email, password} = req.body;

    let user = await userModel.findOne({username});
    if(!user) return res.send("Incorrect username or password");

    bcrypt.compare(password, user.password, function(err,result){
        if(result){
            let token = jwt.sign({email}, "key");
            res.cookie("token", token)
            res.send("loggedIn")
        }
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});