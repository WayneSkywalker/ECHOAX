const express = require('express'),
    bodyParser = require('body-parser'),
    //cookieParser = require('cookie-parser'), 
    mongoose = require('mongoose'),
    passport = require('passport'), 
    validator = require('express-validator'), 
    session = require('express-session'),
    flash = require('connect-flash'),
    localStrategy = require('passport-local'),
    bcrypt = require('bcryptjs'); 
    member = require('./models/member'),
    news = require('./models/news');
const app = express();

/* MongoDB */
// connect
mongoose.connect("mongodb://localhost/echoax");
let db = mongoose.connection;
// connection check
db.once("open", function(){
    console.log("Connected to MongoDB");
});
// error check
db.on("error", function(){
    console.log(err);
});

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(validator());
// app.use(cookieParser());
// app.set('trust proxy', 1) // trust first proxy

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

app.use(passport.initialize());
app.use(passport.session());

// passport.use(new localStrategy(member.authenticate()));
// passport.serializeUser(member.serializeUser());
// passport.deserializeUser(member.deserializeUser());

/* main */
app.get("/", function(req,res){
    res.render("main");
});
app.get("/main", function (req, res) {
    res.render("main");
});
/* new */
app.get("/new", function(req,res){
    res.render("new");
});
/* popular */
app.get("/popular", function (req, res) {
    res.render("popular");
});
/* about us */
app.get("/aboutus", function (req, res) {
    res.render("aboutus");
});

/* search */

/* register */
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

    // check if username has already existed.
    // function validateUsernameAccessibility(username){
    //     return member.findOne({username: username}).then(function(result){
    //         return result === null;
    //     });
    // }
    // let checkUsername = validateUsernameAccessibility(username).then(function(valid){
    //     if(!valid){
    //         return member.findOne({username: username}).then(function(){
    //             return member.username;
    //         });
    //     }
    // });
    // check if E-mail has already existed.
    function validateEmailAccessibility(email){
        return member.findOne({ email: email }).then(function(result){
            return result === null;
        });
    }
    // let checkEmail = validateEmailAccessibility(email).then(function(valid){
    //     if(!valid){
    //         return member.findOne({email: email}).then(function(){
    //             return member.email;
    //         });
    //     }
    // });
    validateEmailAccessibility(email).then(function (valid) {
        if (valid) {
            console.log(valid);
            console.log("Email is valid");
        } else {
            console.log(valid)
            console.log("Email already used");
        }
    });

    req.checkBody('username', 'Username is required.').notEmpty();
    req.checkBody('username', 'Username has already existed.').equals(checkUsername);
    req.checkBody('email', 'E-mail is required.').notEmpty();
    req.checkBody('email', 'E-mail is not valid.').isEmail();
    req.checkBody('email', 'E-mail has already existed.').equals(checkEmail);
    req.checkBody('password', 'Password is required.').notEmpty();
    req.checkBody('password', 'Password must be least 6 characters long.').isLength({ min: 6 });
    req.checkBody('confirm_password', 'Please confirm your password.').notEmpty();
    req.checkBody('confirm_password', 'Passwords do not match.').equals(req.body.password);
    req.checkBody('firstname', 'Firstname is required.').notEmpty();
    req.checkBody('lastname', 'Lastname is required.').notEmpty();
    req.checkBody('gender', 'Gender is required.').notEmpty();
    req.checkBody('birthdate', 'Birthdate is required.').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
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
                        //res.flash("success","You are now registered and can log in.")
                        res.redirect("/main");
                    }
                });
            });
        });
    }
});

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
app.get("/:category/:subcategory", function(req,res){
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
});

/* news */
app.get("/news", function (req, res) {     //unfinished
    res.render("news");
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

/* 404 not found. */
app.get("*", function (req, res) {
    res.send("<h1>404 not found<h1>");
});

//listen to port 3000
app.listen(3000,function(){
    console.log("listen to 3000");
});