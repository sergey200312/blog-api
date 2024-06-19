const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    text: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 300
    },
    date: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model("Comment", CommentSchema);