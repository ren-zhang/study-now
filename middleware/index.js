const StudySpot = require("../models/studySpot");

var middlewareObj = {};

middlewareObj.checkSpotOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        StudySpot.findById(req.params.id, function(err, foundSpot) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundSpot.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = 
function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user_id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = middlewareObj;