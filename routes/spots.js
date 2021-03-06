const express = require("express");
const router = express.Router();
const StudySpot = require("../models/studySpot");
const middleware = require("../middleware");

// INDEX - show all spots
router.get("/", function(req, res){
    // Get all spots from DB
    StudySpot.find({}, function(err, allStudySpots){
       if(err){
           console.log(err);
       } else {
          res.render("spots/index",{studySpots: allStudySpots});
       }
    });
});

// CREATE - add new spot to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to spot array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id, 
        username: req.user.username
    }
    var newSpot = {name: name, image: image, description: desc, author: author}
    // Create a new campground and save to DB
    StudySpot.create(newSpot, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to spots page
            res.redirect("/spots");
        }
    });
});

// NEW - show form to create new spot
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("spots/new"); 
});

// SHOW - shows more info about one spot
router.get("/:id", function(req, res){
    //find the spot with provided ID
    StudySpot.findById(req.params.id).populate("comments").exec(function(err, foundSpot){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("spots/show", {spot: foundSpot});
        }
    });
});

// Edit studyspot route
router.get("/:id/edit", middleware.checkSpotOwnership, function(req, res) {
    StudySpot.findById(req.params.id, function(err, foundSpot) {
        res.render("spots/edit", {spot: foundSpot});
    });
});
// Update studyspot route

router.put("/:id", middleware.checkSpotOwnership, function(req, res) {
    StudySpot.findOneAndUpdate(req.params.id, req.body.spot, function(err, updatedSpot) {
        if (err) {
            res.redirect("/spots");
        } else {
            res.redirect("/spots/" + req.params.id);
        }
    });
});

// Delete studyspot route
router.delete("/:id", middleware.checkSpotOwnership, function(req, res) {
    StudySpot.findOneAndDelete(req.params.id, function(err) {
        if (err) {
            res.redirect("/spots");
        } else {
            res.redirect("/spots");
        }
    })
})

module.exports = router;
