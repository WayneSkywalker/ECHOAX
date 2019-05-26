const mongoose = require('mongoose');

let NewsSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subCategory: String,
    // news_pic: {
    //     type: String     
    // },
    des: {
        type: String,
        required: true
    },
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
    date_posted: {
        type: Date,
        default: Date.now
    },
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
let news = mongoose.model("news",NewsSchema);