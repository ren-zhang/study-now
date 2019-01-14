const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// Root route
router.get("/", function(req, res) {
    res.render("landing");
});

// Register route
router.get("/register", function(req, res){
   res.render("register"); 
});

// Register logic route
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/spots"); 
        });
    });
});

// Login route
router.get("/login", function(req, res){
   res.render("login"); 
});

// Login logic route
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/spots",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/spots");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
