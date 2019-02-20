const express = require("express");
const router = express.Router({mergeParams: true});
const StudySpot = require("../models/studySpot");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// Comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
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
router.post("/", middleware.isLoggedIn, function(req, res){
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

// comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {spot_id: req.params.id, comment: foundComment});
        }
    });
});

// comment update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/spots/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/spots/" + req.params.id);
        }
    });
});

module.exports = router;
