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
        minlength: 5
    },
    content: {
        type: String,
        required: true,
        minlength: 1
    },
    image: {
        type: String
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
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

PostSchema.virtual('formattedDate').get(function() {
    return DateTime.fromJSDate(this.date).toFormat('yyyy-MM-dd HH:mm:ss');
});

module.exports = mongoose.model("Post", PostSchema);
