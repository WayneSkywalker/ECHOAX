const express = require('express');
const router = express.Router();

let news = require('../models/news');

/* new */
router.get("/new", function (req, res) {
    res.render("new");
});
/* popular */
router.get("/popular", function (req, res) {
    res.render("popular");
});

/* search */


/* category */
app.get("/category", function (req, res) {
    res.render("category");
});
app.get("/:category", function (req, res) {
    let category = req.params.category;
    let categories = ['fakenews', 'hoax', 'phishing'];
    for (let i = 0; i < categories.length; i++) {
        if (category === categories[i]) {
            if ((category === 'fakenews') || (category === 'hoax')) res.render("category_sub", { category: category });
            else res.render("phishing");
        }
    }
});
app.get("/:category/:subcategory", function (req, res) {
    let category = req.params.category;
    let subcategory = req.params.subcategory;
    let categories = ['fakenews', 'hoax', 'phishing'];
    let fakecate = ['politics', 'economics', 'crime'];
    let hoaxcate = ['aprilfoolday', 'science', 'health'];
    for (let i = 0; i < categories.length; i++) {
        if (category === categories[i]) {
            if (category === 'fakenews') {
                for (let j = 0; j < fakecate.length; j++) {
                    if (subcategory === fakecate[j]) res.render("contents", { category: category, subcategory: subcategory });
                }
            } else if (category === 'hoax') {
                for (let j = 0; j < hoaxcate.length; j++) {
                    if (subcategory === hoaxcate[j]) res.render("contents", { category: category, subcategory: subcategory });
                }
            } else res.render("phishing");
        }
    }
});

/* news */
app.get("/news", function (req, res) {     //unfinished
    res.render("news");
});

/* create news */
app.get("/echo", function (req, res) {          //unfinished
    res.render("echo");
});

//admin's part
router.get("/userrequest", function (req, res) {      //unfinished
    res.render("user_request");
});
router.get("/userecho", function (req, res) {         //unfinished
    res.render("user_echo");
});

module.exports = router;