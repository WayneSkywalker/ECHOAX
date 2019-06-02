const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'), 
    validator = require('express-validator'), 
    session = require('express-session'),
    config = require('./config/database'),
    bcrypt = require('bcryptjs');
    //flash = require('connect-flash');
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
    //cookie: { secure: true }
}));

/* express-messages */
// app.use(require('connect-flash')());
// app.use(function (req, res, next) {
//     res.locals.messages = require('express-messages')(req, res);
//     next();
// });

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
    res.locals.user = req.user || null;
    console.log(res.locals.user);
    next();
});

/* main */
app.get("/", function(req,res){
    res.render("main",{Member: req.user});
});
app.get("/main", function (req, res) {
    res.render("main",{Member: req.user});
});

/* about us */
app.get("/aboutus", function (req, res) {
    res.render("aboutus",{Member: req.user});
});

/* Route Files */
// let members = require("./routes/members");
// let news = require("./routes/news");
// app.use("/members", members);
// app.use("/news", news);
/* sign up */
app.get("/signup", function (req, res) {
    res.render("signup", { Member: req.user });
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
        //res.send(errors);
        console.log(errors);
        console.log(check);
        res.redirect("/signup");
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
                        res.redirect("/login");
                    }
                });
            });
        });
    }
});

/* log in */
app.get("/login", function (req, res) {
    res.render("login", { Member: req.user });
});

app.post("/login", function (req, res, next) {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next);
});

/* log out */
// test
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/login");
});

/* user's profile */
app.get("/profile", ensureAuthenticated,function (req, res) {
    member.findById(req.user.id, function (err, member) {
        if (err) {
            console.log(err);
        } else {
            //console.log(member);
            res.render("profile", { member: req.user, Member: req.user });
        }
    });
});
/* edit user's profile */
app.get("/editprofile",ensureAuthenticated,function (req, res) {
    member.findById(req.user.id, function(err, member){
        if(err){
            console.log(err);
        } else {
            res.render("edit", { member: member, Member: req.user });
        }
    });
});
app.post("/editprofile/:id", function(req,res){
    let oldpassword = req.body.oldpassword;
    let newpassword = req.body.newpassword;
    let renewpassword = req.body.renewpassword;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let location = req.body.location;
    let bio = req.body.bio;

    let query = {_id: req.params.id};

    member.findById(req.params.id, function(err,members){
        if(err){
            console.log(err);
        } else {
            if(!oldpassword){
                oldpassword = members.password;
            } else {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(oldpassword, salt, function (err, hash) {
                        if (err) {
                            console.log(err);
                        }
                        oldpassword = hash;
                    });
                });
            }
            if(!firstname){
                firstname = members.firstname;
            }
            if(!lastname){
                lastname = members.lastname;
            }
            if(oldpassword === members.password){
                if(newpassword === renewpassword){
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(newpassword, salt, function (err, hash) {
                            if (err) {
                                console.log(err);
                            }
                            newpassword = hash;
                            let mem = {};
                            mem.username = members.username;
                            mem.password = newpassword;
                            mem.email = members.email;
                            mem.firstname = firstname;
                            mem.lastname = lastname;
                            mem.gender = members.gender;
                            mem.birthdate = members.birthdate;
                            mem.location = location;
                            mem.bio = bio;
                            mem.level = members.level;
                            mem.fvote_yes = members.fvote_yes;
                            mem.hvote_yes = members.hvote_yes;
                            mem.fvote_no = members.fvote_no;
                            mem.hvote_no = members.hvote_no;
                            member.update(query, mem, function (err) {
                                if (err) {
                                    console.log(err);
                                    return;
                                } else {
                                    res.redirect("/profile");
                                }
                            });
                        });
                    });
                } else {
                    res.redirect("/editprofile");
                }
            } else {
                res.redirect("/editprofile");
            }
        }
    });
});

/* new */
app.get("/new",function (req, res) {
    news.find({ category: 'fakenews', status: 'posted' }).sort({ date_posted: -1 }).limit(3).then(function (fakeNews) {
        news.find({ category: 'hoax', status: 'posted' }).sort({ date_posted: -1 }).limit(3).then(function (hoax) {
            news.find({ category: 'phishing', status: 'posted' }).sort({ date_posted: -1 }).limit(3).then(function (phishing) {
                res.render("new", { fakeNews: fakeNews, hoax: hoax, phishing: phishing ,Member: req.user});
            });
        });
    });
});
/* popular */
app.get("/popular", function (req, res) {
    news.find({ category: 'fakenews', status: 'posted' }).sort({ voteYes: -1 }).limit(3).then(function (fakeNews) {
        news.find({ category: 'hoax', status: 'posted' }).sort({ voteYes: -1 }).limit(3).then(function (hoax) {
            news.find({ category: 'phishing', status: 'posted' }).sort({ voteYes: -1 }).limit(3).then(function (phishing) {
                res.render("popular", { fakeNews: fakeNews, hoax: hoax, phishing: phishing,Member: req.user });
            });
        });
    });
});

/* search */
// main search
app.post("/mainsearch", function(req,res){      
    news.find({title: req.body.mainsearch,status: 'posted'}).then(function(findNews){
        if(findNews){
            console.log(findNews);
            res.render("search", { news: findNews, Member: req.user });
        } else {
            res.redirect("/notfound");
        }
    });
});
app.get("search", function(req,res){
    res.render("search", { Member: req.user });
});
//fake news search
app.post("/fakenewssearch", function (req, res) {  
    news.find({ title: req.body.fakenewssearch, category: 'fakenews', status: 'posted'}).then(function(findNews){
        if(findNews){
            console.log(findNews);
            res.render("search", { news: findNews, Member: req.user });
        } else {
            res.redirect("/notfound");
        }
    }).catch(function(err){
        console.log(err);
    });
});
//hoax search
app.post("/hoaxsearch",  function (req, res) {
    news.find({ title: req.body.hoaxsearch, category: 'hoax', status: 'posted' }).then(function (findNews) {
        if (findNews) {
            console.log(findNews);
            res.render("search", { news: findNews, Member: req.user });
        } else {
            res.redirect("/notfound");
        }
    }).catch(function (err) {
        console.log(err);
    });
});
//phishing search
app.post("/phissearch", function (req, res) {
    member.find({ title: req.body.phissearch, category: 'phishing' }).then(function (findNews) {
        if (findNews) {
            console.log(findNews);
            res.render("search", { news: findNews, Member: req.user  });
        } else {
            res.redirect("/notfound");
        }
    }).catch(function (err) {
        console.log(err);
    });
});

/* single news */
app.get("/news/:id", function (req, res) {
    news.findById(req.params.id, function (err, news) {
        if(err){
            console.log(err);
        } else {
            res.render("news", { news: news, Member: req.user });
        }
    });
});

/* create news */
app.get("/echo", ensureAuthenticated, function (req, res) {
    res.render("echo", { Member: req.user });
});
app.post("/echo",ensureAuthenticated,function(req,res){
    let echo = new news();
    echo.title = req.body.title;
    echo.category = req.body.category;
    echo.subCategory = req.body.subcategory;
    echo.author = req.user.username;
    echo.content = req.body.echo;
    echo.ref1 = req.body.ref1;
    echo.ref2 = req.body.ref2;
    echo.save(function(err){
        if(err){
            console.log(err);
            return;
        } else {
            res.redirect("/success");
        }
    })
});

/* admin's part */
// view users's requests
app.get("/userrequest",ensureAuthenticated,  function (req, res) {
    news.find({ status: 'wait' }).then(function (findNews) {
        res.render("user_request", { news: findNews, Member: req.user });
    });
    //res.render("user_request");
});
// view user's news
app.get("/userecho/:id", ensureAuthenticated, function (req, res) {
    news.findById(req.params.id, function(err,news){
        if(err){
            console.log(err);
        } else {
            res.render("user_echo", { news: news, Member: req.user});
        }
    });
});

// grant post permission
app.post("/postnews/:id", function(req,res){
    let query = {_id: req.params.id};
    let time = Date.now();
    news.findById(req.params.id, function(err,newss){
        if(err){
            console.log(err);
        } else {
            newss.status = 'posted';
            newss.date_posted = time;
            news.update(query,newss, function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log(newss.date_posted);
                    console.log(newss);
                    res.redirect("/userrequest");
                }
            });
        }
    });
});
// delete user's post
app.get("/deletenews/:id", function(req,res){
    news.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/userrequest");
        }
    });
});

app.get("/notfound",function(req,res){
    res.render("notfound", { Member: req.user });
});
app.get("/success",function(req,res){
    res.render("success", { Member: req.user });
});

function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

/* category */
app.get("/category", function (req, res) {
    res.render("category", { Member: req.user });
});
app.get("/:category", function (req, res) {
    let category = req.params.category;
    let categories = ['fakenews', 'hoax', 'phishing'];
    for (let i = 0; i < categories.length; i++) {
        if (category === categories[i]) {
            if ((category === 'fakenews') || (category === 'hoax')) res.render("category_sub", { category: category, Member: req.user });
            else {
                news.find({ category: category, status: 'posted' }).then(function (findNews) {
                    res.render("phishing", { news: findNews, Member: req.user });
                }).catch(function (err) {
                    console.log(err);
                });
            }
        }
    }
});

app.get("/:category/:subcategory", function (req, res) {   
    let category = req.params.category;
    let subcategory = req.params.subcategory;
    let categories = ['fakenews', 'hoax', 'phishing'];
    let fakecate = ['politics', 'economics', 'crime'];
    let hoaxcate = ['aprilfoolsday', 'science', 'health'];
    for (let i = 0; i < categories.length; i++) {
        if (category === categories[i]) {
            if (category === 'fakenews') {
                for (let j = 0; j < fakecate.length; j++) {
                    if (subcategory === fakecate[j]) {
                        news.find({ category: category, subCategory: subcategory ,status: 'posted' }).then(function (findNews) {
                            res.render("contents", { category: category, subcategory: subcategory, news: findNews, Member: req.user });
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }
                }
            } else if (category === 'hoax') {
                for (let j = 0; j < hoaxcate.length; j++) {
                    if (subcategory === hoaxcate[j]) {
                        news.find({ category: category, subCategory: subcategory, status: 'posted' }).then(function (findNews) {
                            res.render("contents", { category: category, subcategory: subcategory, news: findNews, Member: req.user });
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }
                }
            }
        }
    }
});

//------------------------------------------------------------------------------------------------------------------------------------app
/* listen to port 3000 */
app.listen(3000,function(){
    console.log("listen to 3000");
});