require('dotenv').config()
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const saltRounds=10;
// const md5=require("md5");
// var encrypt = require('mongoose-encryption');
const ejs=require("ejs");

mongoose.connect("mongodb://localhost:27017/userDb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const userSchema= new mongoose.Schema({
    name:String,
    password:String

})

// userSchema.plugin(encrypt, {secret:process.env.SECRET,encryptedField:["password"]});

const User= mongoose.model("User",userSchema);
const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended:true
}));
app.set('view engine','ejs');


app.get("/",function(req,res)
{
    res.render("home");
})
app.get("/login",function(req,res)
{
    res.render("login");
})
app.get("/register",function(req,res)
{
    res.render("register");
})

app.post("/register",function(req,res)
{

    console.log("Inside register");
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

        const newUser= new User({
            name:req.body.username,
            password:hash
            
    
        })
        newUser.save(function(err){
            if(!err)
            {
                res.render("home");
            }
            console.log(err);
        });
        // Store hash in your password DB.
    });
    
})

app.post("/login",function(req,res)
{

    console.log(req.body.username);
    User.findOne({name:req.body.username},function(err,result){
        if(!err)
        {
            bcrypt.compare(req.body.password, result.password, function(err, result) {
                // result == true
                if(result)
                {
                    res.render("secrets");
                }
                else{
                    res.render("login");
                }
            });
        }
    }
    )
})
        //     if(result.password===md5(req.body.password))
        //     {
        //         console.log("succ");
        //         res.render("secrets");
        //     }
        //     else{
        //         res.render("login");
        //     }
        // }
    //     else{
    //         console.log(err);
    //     }
    
    






app.listen(3000,function(){
    console.log("Running on port 3000")
}) 