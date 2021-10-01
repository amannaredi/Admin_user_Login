const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const alert =  require("alert")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const JWT = require("jsonwebtoken")
const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

 const userSchema = {
     name : String ,
     contact : String,
     email : String,
     password : String
 }

 const User = mongoose.model("User" , userSchema)
 const Admin = mongoose.model("Admin" , userSchema)


app.get("/" , function(req, res){
    res.render("home")
})
app.get("/register" , function(req , res){
    res.render("register")
})
app.get("/login" , function(req, res){
    res.render("login")
})
app.get("/register-admin" , function(req , res){
    res.render("admin-register")
})
app.get("/login-admin" , function(req, res){
    res.render("admin-login")
})


app.post("/register" , function(req, res){
    const name = req.body.name
    const contact = req.body.contact
    const email = req.body.username
    const password = req.body.password 
    const hash = bcrypt.hashSync(password, saltRounds);

    const user = new User ({
        name : name,
        contact : contact,
        email : email,
        password : hash 
    })
    user.save(function(err){
        if (err){
            console.log(err)
            res.sendFile(__dirname + "/failure.html")
        }
        else {
            res.render("success-query" , {query : "Your record has been saved" })
        }
    }) 
    const token = JWT.sign({ email }, "nfb32iur32ibfqfvi3vf932bg932g932", {expiresIn: 360000});
});  

data = []
adm = []
app.post("/login", function(req, res){
    data.splice(0,2)
    const email = req.body.username
    const password = req.body.password 
    User.find({email : email }, function(err, foundUser){
        if (err){
            console.log("err")
        }
        else{
            if (foundUser){
                bcrypt.compare(password, foundUser[0].password, function(err, result) {
                    if (result === true){
                        // res.redirect("/success-user")
                        res.render("success-user" , {query : "You are logged in"})
                    }
                    else{
                        res.sendFile(__dirname + "/failure.html")
                    }
                });
            }
            else{
                res.sendFile(__dirname + "/failure.html")
            }
        }
    })
    data.push(email , password)
    const token = JWT.sign({email}, "nfb32iur32ibfqfvi3vf932bg932g932", {expiresIn: 360000})
})

let checkAuth = async (req, res, next) => {
    const token = req.header('x-auth-token')
    if(!token){
        res.status(401).json({
            errors: [
                {
                    msg: "No token found"
                }
            ]
        })
    }

    try {
        const user = await JWT.verify(token, "nfb32iur32ibfqfvi3vf932bg932g932")
        req.user = user.email
        next()
    } 
    catch (error) {
        res.status(400).json({
            errors: [
                {
                    msg: 'Invalid Token'
                }
            ]
        })
    }
}

app.post("/deleteAccount" ,checkAuth, function(req, res){
    User.find({email : data[0]}, function(err , foundUser){
        if(err){
            console.log(err)
        }
        else{
            if(foundUser){
                bcrypt.compare(data[1], foundUser[0].password , function(err, result){
                    if(result === true){
                        User.findOneAndDelete({email : data[0]}, function(err){
                            if(err){
                                console.log(err)
                            }
                            else{
                                res.render("success-query" , {query : "Your Account has been deleted"})  
                            }
                        })
                    }
                })
            }
        }
    })
})

app.get("/ChangePassword",checkAuth, function(req, res){
    res.sendFile(__dirname + "/changePassword.html")
    console.log(data)
})

app.post("/changePassword" , function(req , res){
    res.redirect("/ChangePassword") 
 })
app.post("/change" , function(req,res){
    
    const currentPassword = req.body.password
    const newPassword = req.body.newpassword
    const hash = bcrypt.hashSync(newPassword, saltRounds);
    User.find({email:data[0]}, function(err, foundUser){
        if(err){
            console.log(err)
        }
        else{
            bcrypt.compare(currentPassword, foundUser[0].password, function(err , result){
                if(result === true){
                    User.findOneAndUpdate({email : data[0]}, {$set:{
                        password : hash
                        }},
                        { new: true }, function(err,doc){
                            if (err){
                                console.log(err)
                                res.sendFile(__dirname + "/failure.html")
                            }
                            else{
                                res.render("success-query" , {query : "Password has been changed"})
                                console.log("password updated")
                                
                            }
                        }
                    )
                }
                else{
                    alert("Wrong Password")
                }
                
            })
        }
    })
    
}) 


app.post("/register-admin" , function(req, res){
    const name = req.body.name
    const contact = req.body.contact
    const email = req.body.username
    const password = req.body.password 
    const hash = bcrypt.hashSync(password, saltRounds);

    const admin = new Admin ({
        name : name,
        contact : contact,
        email : email,
        password : hash 
    })
    admin.save(function(err){
        if (err){
            console.log(err)
            res.sendFile(__dirname + "/failure.html")
        }
        else {
            res.render("success-query" , {query : "Your record has been saved" })
        }
    }) 
    const token = JWT.sign({email}, "nfb32iur32ibfqfvi3vf932bg932g932", {expiresIn: 360000})
});  


app.post("/login-admin", function(req, res){
    adm.splice(0,2)
    const email = req.body.username
    const password = req.body.password 
    Admin.find({email : email}, function(err, foundUser){
        if (err){
            console.log("error")
        }
        else{
            if (foundUser){
                bcrypt.compare(password, foundUser[0].password, function(err, result) {
                    if (result === true){
                        res.render("success-admin" , {query : "You are logged in"})
                    }
                    else{
                        res.sendFile(__dirname + "/failure.html")
                    }
                });
            }
            
        }
    })
    adm.push(email , password)
    const token = JWT.sign({email}, "nfb32iur32ibfqfvi3vf932bg932g932", {expiresIn: 360000})


})

app.get("/ChangePassword-admin" ,checkAuth, function(req, res){
    res.sendFile(__dirname + "/changePassword-admin.html")
    console.log(data)
})

app.post("/changePassword-admin" , function(req , res){
    res.redirect("/ChangePassword-admin") 
 })
app.post("/change-admin" , function(req,res){
    const currentPassword = req.body.password
    const newPassword = req.body.newpassword
    const hash = bcrypt.hashSync(newPassword, saltRounds);
    Admin.find({email:adm[0]}, function(err, foundUser){
        if(err){
            console.log(err)
        }
        else{
            bcrypt.compare(currentPassword, foundUser[0].password, function(err , result){
                if(result === true){
                    Admin.findOneAndUpdate({email : adm[0]}, {$set:{
                        password : hash
                        }},
                        { new: true }, function(err,doc){
                            if (err){
                                console.log(err)
                                res.sendFile(__dirname + "/failure.html")
                            }
                            else{
                                console.log("password updated")
                                res.render("success-query" , {query : "Password has been changed"})
                            }
                        }
                    )
                }
                else{
                    alert("Wrong Password")
                }
                
            })
        }
    })
    
}) 


app.post("/delete-users-account", function(req , res){
    res.redirect("/delete")
})
app.get("/delete",checkAuth, function(req, res){
    res.render("delete-user")
})
app.post("/delete", function(req,res){
    const name = req.body.name
    const email = req.body.username
    User.find({email : email, name : name}, function(err ,  foundUser){
        if (foundUser.length !=0){
            User.findOneAndDelete({email : email, name : name} , function(err, foundUser){
                if(err){
                    console.log(err)
                }
                else{
                    res.render("success-query" , {query : "User's Account has been deleted"})
                }
            })
        }
        else{
            alert("No such user found!") 
        }
    })
    

})

app.post("/failure" , function(req, res){
    res.redirect("/")
})
 app.listen(3000 , function(){
     console.log("Server started at port 3000");
} )
