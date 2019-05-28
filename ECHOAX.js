const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'), 
    validator = require('express-validator'), 
    session = require('express-session'),
    config = require('./config/database'),
    bcrypt = require('bcryptjs'),
    flash = require('connect-flash');
const app = express();

/* MongoDB */
// connect
mongoose.connect(config.database);
let db = mongoose.connection;
// connection check
db.once("open", function(){
    console.log("Connected to MongoDB");
});
// error check
db.on("error", function(){
    console.log(err);
});

let member = require('./models/member');
let news = require('./models/news');

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

/* express-session */
app.use(session({
    secret: 'echoax',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

/* express-messages */
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

/* express-validator */
app.use(validator({
    errorFormatter: function(param, msg, value){
        let namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;
        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

/* passport  */
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get("*", function(req,res,next){
    res.locals.member = req.member || null;
    next();
});

/* main */
app.get("/", function(req,res){
    res.render("main");
});
app.get("/main", function (req, res) {
    res.render("main");
});

/* about us */
app.get("/aboutus", function (req, res) {
    res.render("aboutus");
});

/* Route Files */
// let members = require("./routes/members");
// let news = require("./routes/news");
// app.use("/members", members);
// app.use("/news", news);
//---------------------------------------------------------------------------------------------------------------------------------------------
/* sign up */
app.get("/signup", function (req, res) {
    res.render("signup");
});
app.post("/register", function (req, res) {
    //create account
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let confirm_password = req.body.confirm_password;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let gender = req.body.gender;
    let birthdate = req.body.birthdate;
    let location = req.body.location;
    let bio = req.body.bio;

    let check = [];
    member.findOne({ username: username }).then(function (result) {
        if (result) {
            check.push("Userneme is already used.");
            console.log(result.username);
            console.log("no! 01");
        } else {
            console.log(result);
            console.log("01 this function can be used.");
        }
    });
    member.findOne({ email: email }).then(function (result) {
        if (result) {
            check.push("E-mail is already used.");
            console.log(result.email);
            console.log("no! 02");
        } else {
            console.log(result)
            console.log("02 this function can be used.");
        }
    });
    req.checkBody('username', 'Username is required.').notEmpty();
    req.checkBody('email', 'E-mail is required.').notEmpty();
    req.checkBody('email', 'E-mail is not valid.').isEmail();
    req.checkBody('password', 'Password is required.').notEmpty();
    req.checkBody('password', 'Password must be least 6 characters long.').isLength({ min: 6 });
    req.checkBody('confirm_password', 'Please confirm your password.').notEmpty();
    req.checkBody('confirm_password', 'Passwords do not match.').equals(password);
    req.checkBody('firstname', 'Firstname is required.').notEmpty();
    req.checkBody('lastname', 'Lastname is required.').notEmpty();
    req.checkBody('gender', 'Gender is required.').notEmpty();
    req.checkBody('birthdate', 'Birthdate is required.').notEmpty();

    let errors = req.validationErrors();

    if (errors || check) {
        //res.render("signup");
        //res.render("test",{errors: errors});
        res.send(errors);
    } else {
        let newMember = new member({
            username: username,
            password: password,
            email: email,
            firstname: firstname,
            lastname: lastname,
            gender: gender,
            birthdate: birthdate,
            location: location,
            bio: bio
        });
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newMember.password, salt, function (err, hash) {
                if (err) {
                    console.log(err);
                }
                newMember.password = hash;
                newMember.save(function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        res.flash("success", "You are now registered and can log in.")
                        res.redirect("/main");
                    }
                });
            });
        });
    }
});

/* log in */
app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", function (req, res, next) {
    passport.authenticate("local", {
        //successRedirect: "/",
        successRedirect: "/test",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next);
});

/* log out */
// test
app.get("/test",function(req,res){
    res.render("test");
});
app.get("/logout", function (req, res) {
    req.logout();
    req.flash('success', 'You are logged out.');
    res.redirect("/login");
});

//user's part
app.get("/profile", function (req, res) {          //unfinished
    res.render("profile");
});
app.get("/editprofile", function (req, res) {   //unfinished
    res.render("edit");
});
//-----------------------------------------------------------------------------------------------------------------------------------------
/* new */
app.get("/new", function (req, res) {
    res.render("new");
});
/* popular */
app.get("/popular", function (req, res) {
    res.render("popular");
});

/* search */
// main search
app.post("/mainsearch", function(req,res){      //unfinished    not complete
    let search = req.body.mainsearch;
    member.find({title: search}, function (err, findNews) {
        if (err) {
            console.log(err);
        } else if(findNews) {
            console.log(findNews);
            res.redirect("/search");
        } else {
            console.log("NO");
            res.redirect("/");
            //res.redirect("/notfound");
        }
    });
});
app.get("search", function(req,res){
    res.render("search");
});
//fake news search
app.post("/fakenewssearch", function (req, res) {  //unfinished    not complete
    let search  = req.body.fakenewssearch;
    member.find({ title: search, category: 'fakenews' }).then(function (result) {
        if (result) {
            console.log(result);
            res.redirect("/"); //redirect somewhere
        } else {
            console.log("ERROR!");
        }
    }).catch(function (err) {
        console.log(err);
    });
});
//hoax search
app.post("/hoaxsearch", function (req, res) {   //unfinished    not complete
    let search = req.body.hoaxsearch;
    member.find({ title: search, category: 'hoax' }).then(function (result) {
        if (result) {
            console.log(result);
            res.redirect("/"); //redirect somewhere
        } else {
            console.log("ERROR!");
        }
    }).catch(function (err) {
        console.log(err);
    });
});
//phishing search
app.post("/phissearch", function (req, res) {      //unfinished    not complete
    let search = req.body.phissearch;
    member.find({ title: search, category: 'phishing' }).then(function (result) {
        if (result) {
            console.log(result);
            res.redirect("/"); //redirect somewhere
        } else {
            console.log("ERROR!");
        }
    }).catch(function (err) {
        console.log(err);
    });
});

/* news */
app.get("/news/:id", function (req, res) {     //unfinished
    // let id = req.params.id;
    // member.findById(id, function (err, foundNews) {
    //     if (err) {
    //         console.log(err);
    //         res.redirect("/category");
    //         //res.redirect("/notfound");
    //     } else {
    //         console.log(foundNews);
    //         res.render("news", { news: foundNews });
    //     }
    // })
    res.render("news");
});

/* create news */
app.get("/echo", function (req, res) {          //unfinished
    res.render("echo");
});
app.post("/echo",function(req,res){
    let echo = new news();
    echo.title = req.body.title;
    echo.category = req.body.category;
    echo.subCategory = req.body.subcategory;
    //echo.author = req.body.author;
    //echo.author = req.member;
    echo.author = 'quay';
    echo.content = req.body.echo;
    echo.ref1 = req.body.ref1;
    echo.ref2 = req.body.ref2;
    echo.save(function(err){
        if(err){
            console.log(err);
            return;
        } else {
            console.log("success!");
            res.redirect("/profile");
        }
    })
});

//admin's part
app.get("/userrequest", function (req, res) {      //unfinished query get something i don't know
    member.find({status: 'wait'},function(err,foundNews){
        if(err){
            console.log("ERROR!");
            console.log(err);
        } else if(foundNews){
            console.log("success!");
            res.render("user_request", { foundNews: foundNews });
        } else {
            console.log("not found!");
        }
    });
    //res.render("user_request");
});
app.get("/userecho/:id", function (req, res) {         //unfinished
    // let id = req.params.id;
    // member.findById(id, function (err, foundNews) {
    //     if (err) {
    //         console.log(err);
    //         res.redirect("/category");
    //         //res.redirect("/notfound");
    //     } else {
    //         console.log(foundNews);
    //         res.render("news", { news: foundNews });
    //     }
    // })
    res.render("user_echo");
});

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

app.get("/:category/:subcategory", function (req, res) {    //unfinished    cannot route
    let category = req.params.category;
    let subcategory = req.params.subcategory;
    let categories = ['fakenews', 'hoax', 'phishing'];
    let fakecate = ['politics', 'economics', 'crime','health','technology','sport','entertainment','education','science'];
    let hoaxcate = ['aprilfoolsday', 'science', 'health'];
    for (let i = 0; i < categories.length; i++) {
        if (category === categories[i]) {
            if (category === 'fakenews') {
                for (let j = 0; j < fakecate.length; j++) {
                    if (subcategory === fakecate[j]) {
                        res.render("contents", { category: category, subcategory: subcategory });
                    }
                }
            } else if (category === 'hoax') {
                for (let j = 0; j < hoaxcate.length; j++) {
                    if (subcategory === hoaxcate[j]) {
                        res.render("contents", { category: category, subcategory: subcategory });
                    }
                }
            } else res.render("phishing");
        }
    }
});

// /* news */
// app.get("/news/:id", function (req, res) {     //unfinished
//     let id = req.params.id;
//     member.findById(id, function(err, foundNews){
//         if(err){
//             console.log(err);
//             res.redirect("/category");
//             //res.redirect("/notfound");
//         } else {
//             res.render("news",{news: foundNews});
//         }
//     })
//     res.render("news");
// });

// /* create news */
// app.get("/echo", function (req, res) {          //unfinished
//     res.render("echo");
// });

// //admin's part
// app.get("/userrequest", function (req, res) {      //unfinished
//     res.render("user_request");
// });
// app.get("/userecho", function (req, res) {         //unfinished
//     res.render("user_echo");
// });
//------------------------------------------------------------------------------------------------------------------------------------app
/* listen to port 3000 */
app.listen(3000,function(){
    console.log("listen to 3000");
});