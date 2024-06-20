const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    content: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1000
    },
    date: {
        type: Date,
        required: true
    },
    viewsCount: {
        type: Number,
    },
    likesCount: {
        type: Number,
    }
})

module.exports = mongoose.model("Post", PostSchema);