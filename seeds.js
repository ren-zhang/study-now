const mongoose = require("mongoose");
const StudySpot = require("./models/studySpot");
const Comment = require("./models/comment");

var data = [
    {
        name: "Knox College Library", 
        image: "https://knox.utoronto.ca/wp-content/uploads/Caven-Library01-120dpi1.jpg",
        description: "Beautiful atmosphere perfect for an afternoon of studying."
    },
    {
        name: "Earth Sciences Library",
        image: "http://blogs.studentlife.utoronto.ca/lifeatuoft/files/2009/07/explore1-012-copy.jpg",
        description: "Quiet and contemplative."
    },
    {
        name: "University College Junior Common Room",
        image: "https://www.sindark.com/wp/wp-content/uploads/2014/02/DSCF3079.jpg",
        description: "Not just for UC students!"
    }
]

function seedDB() {    
    StudySpot.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("Study-spots removed");
        data.forEach(function (seed) {
            StudySpot.create(seed, function (err, spot) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Created study-spot");
                    Comment.create(
                        {
                            text: "No internet :(",
                            author: "Ren"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                spot.comments.push(comment);
                                spot.save();
                                console.log("Created new comment");
                            }
                    });
                }
            });
        });    
    });
}

module.exports = seedDB;
