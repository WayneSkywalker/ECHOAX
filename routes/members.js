const express = require('express'),
    bcrypt = require('bcryptjs'),
    passport = require('passport');
const router = express.Router();

let member = require('../models/member');

/* sign up */
router.get("/signup", function (req, res) {
    res.render("signup");
});
router.post("/register", function (req, res) {
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
                        res.flash("success","You are now registered and can log in.")
                        res.redirect("/main");
                    }
                });
            });
        });
    }
});

/* log in */
// log in's page is coming soon.

router.post("/login", function (req, res) {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next);
});

/* log out */
router.get("/logout", function (req, res) {
    req.logout();
    req.flash('success', 'You are logged out.');
    res.redirect("/login");
});

//user's part
router.get("/profile", function (req, res) {          //unfinished
    res.render("profile");
});
router.get("/editprofile", function (req, res) {   //unfinished
    res.render("edit");
});

module.exports = router;