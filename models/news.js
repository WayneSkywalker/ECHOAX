const mongoose = require('mongoose');

let NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    //subCategory: String,
    subCategory: {
        type: String,
        required: true
    },
    // news_pic: {
    //     type: String     
    // },
    des: String,
    content: {
        type: String,
        required: true
    },
    ref1: {
        type: String,
        required: true
    },
    ref2: String,
    author: {
        type: String,
        required: true
    },
    date_requested: {
        type: Date,
        default: Date.now
    },
    date_posted: Date,
    status: {
        type: String,
        default: 'wait',
    },
    voteYes: {
        type: Number,
        default: 0
    },
    voteNo: {
        type: Number,
        default: 0
    }
});
let news = module.exports = mongoose.model("news",NewsSchema);