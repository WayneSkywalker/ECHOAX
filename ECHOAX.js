const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'), 
    validator = require('express-validator'), 
    session = require('express-session'),
    config = require('./config/database'),
    flash = require('connect-flash'),
    member = require('./models/member'),
    news = require('./models/news');
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
    res.locals.user = req.user || null;
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

let members = require('./routes/members');
let newss = require('./routes/newss');
app.use('/members', members);
app.use('/newss', newss);

//listen to port 3000
app.listen(3000,function(){
    console.log("listen to 3000");
});