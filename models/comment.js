const mongoose = require("mongoose");
const Comment = new mongoose.Schema({
    postId: String,
    timeStamp: String,
    username: String,
    description: String,
});

module.exports = mongoose.model("Comment", Comment);