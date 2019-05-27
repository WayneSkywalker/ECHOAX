const mongoose = require('mongoose');

let MemberSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    // profile_pic: {
    //     type: String
    // },
    gender: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    location: String,
    bio: String,
    level: {
        type: String,
        default: 'user' //admin
    },
    vote_yes: {
        type: Number,
        default: 0
    },
    vote_no: {
        type: Number,
        default: 0
    }
});

let member = module.exports = mongoose.model("member",MemberSchema);