const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        minlength: 2,
        maxlength: 20,
        trim: true, 
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
});

module.exports = mongoose.model("User", UserSchema);


