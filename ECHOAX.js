const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    member = require('./models/member'),
    news = require('./models/news');
const app = express();

//mongoose.connect("mongodb://localhost/ECHOAX_app");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

app.get("/", function(req,res){
    res.render("main");
});
app.get("/main", function (req, res) {
    res.render("main");
});
app.get("/new", function(req,res){
    res.render("new");
});
app.get("/popular", function (req, res) {
    res.render("popular");
});
app.get("/aboutus", function (req, res) {
    res.render("aboutus");
});

/* search */

/* category */
app.get("/category", function (req, res) {
    res.render("category");
});
app.get("/:category", function(req,res){
    let category = req.params.category;
    let categories = ['fakenews','hoax','phishing'];
    for(let i = 0;i < categories.length; i++){
        if(category === categories[i]){
            if ((category === 'fakenews') || (category === 'hoax')) res.render("category_sub",{category: category});
            else res.render("phishing");
        }
    }
});
app.get("/:category/:subcategory", function(reqq,res){
    let category = req.params.category;
    let subcategory = req.params.subcategory;
    let categories = ['fakenews', 'hoax', 'phishing'];
    let fakecate = ['politics','economics','crime'];
    let hoaxcate = ['aprilfoolday','science','health'];
    for(let i = 0;i < categories.length; i++){
        if (category === categories[i]) {
            if (category === 'fakenews'){
                for(let j = 0;j < fakecate.length; j++){
                    if(subcategory === fakecate[j]) res.render("contents", {category: category,subcategory: subcategory});
                }
            } else if(category === 'hoax'){
                for(let j = 0;j < hoaxcate.length; j++){
                    if (subcategory === hoaxcate[j]) res.render("contents", { category: category, subcategory: subcategory });
                }
            } else res.render("phishing");
        }
    }
})

/* news */
app.get("/news", function(req,res){     //unfinished
    res.render("news");
});

/* fake news */
// app.get("/fakenews", function(req,res){
//     res.render("fakecate");
// });
// app.get("/fakenews/:ftype", function(req,res){
//     let ftype = req.params.type;
//     let ftypes = ['politics','economics','crime'];
//     for(let i=0;i<ftypes.length;i++){
//         if(ftype === ftypes[i]){
//             res.render("fakenews", { type: ftype });
//         }
//     }
// });

/* hoax */
// app.get("/hoax", function(req,res){
//     res.render("hoaxcate");
// });
// app.get("/hoax/:htype", function (req, res) {
//     let htype = req.params.type;
//     let htypes = ['politics', 'economics', 'crime'];
//     for (let i = 0; i < htypes.length; i++) {
//         if (htype === htypes[i]) {
//             res.render("fakenews", { type: htype });
//         }
//     }
// });

/* phishing */
// app.get("/phishing", function(req,res){
//     res.render("phishing");
// })

/* register */
app.get("/signup", function (req, res) {
    res.render("signup");
});

//user's part
app.get("/profile", function(req,res){          //unfinished
    res.render("profile");
});
app.get("/editprofile", function (req, res) {   //unfinished
    res.render("edit");
});
app.get("/echo", function (req, res) {          //unfinished
    res.render("echo");
});

//admin's part
app.get("/userrequest", function(req,res){      //unfinished
    res.render("user_request");
});
app.get("/userecho", function(req,res){         //unfinished
    res.render("user_echo");
});

//404 not found.
app.get("*", function(req,res){
    res.send("<h1>404 not found<h1>");
});

//listen to port 3000
app.listen(3000,function(){
    console.log("listen to 3000");
});