const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    StudySpot = require("./models/studySpot"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds");


mongoose.connect("mongodb://localhost/study-now");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/spots", function(req, res) {
    StudySpot.find({}, function (err, allStudySpots) {
        if (err) {
            console.log(err);
        } else {
            res.render("spots/index", {studySpots: allStudySpots});
        }
    })
});

app.post("/spots", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newSpot = {name: name, image: image, description: description};

    StudySpot.create(newSpot, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/spots");
        }
    });
});

app.get("/spots/new", function (req, res) {
    res.render("spots/new");
});

app.get("/spots/:id", function (req, res) {
    StudySpot.findById(req.params.id).populate("comments").exec(function (err, foundSpot) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundSpot);
            res.render("spots/show", {spot: foundSpot});
        }
    });
});

app.get("/spots/:id/comments/new", function (req, res) {
    StudySpot.findById(req.params.id, function (err, spot) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {spot: spot}); 
        }
    });
});

app.post("/spots/:id/comments", function (req, res) {
    StudySpot.findById(req.params.id, function (err, spot) {
        if (err) {
            console.log(err);
            res.redirect("/spots");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    spot.comments.push(comment);
                    spot.save();
                    res.redirect("/spots/" + spot._id);
                }
            }); 
        }
    });     
});

app.listen(3000, function() {
    console.log("StudyNow server has started");
});
