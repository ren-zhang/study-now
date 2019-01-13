const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
    text: String,
    author: String
});



module.exports = mongoose.model("Comment", CommentSchema);
