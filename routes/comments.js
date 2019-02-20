const express = require("express");
const router = express.Router({mergeParams: true});
const StudySpot = require("../models/studySpot");
const Comment = require("../models/comment");

// Comments new
router.get("/new", isLoggedIn, function(req, res){
    // find spot by id
    StudySpot.findById(req.params.id, function(err, spot){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {spot: spot});
        }
    })
});

// Comments create
router.post("/",isLoggedIn,function(req, res){
    //lookup spot using ID
    StudySpot.findById(req.params.id, function(err, spot){
        if(err){
            console.log(err);
            res.redirect("/spots");
       } else {
        Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
           } else {
                // add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                spot.comments.push(comment);
                spot.save();
                res.redirect('/spots/' + spot._id);
            }
        });
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
