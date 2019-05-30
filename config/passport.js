const LocalStrategy = require('passport-local').Strategy;
const member = require('../models/member');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
    passport.use(new LocalStrategy(function(username, password, done){
        let query = {username: username};
        member.findOne(query, function(err, Member){
            if(err) throw err;
            if(!Member){
                return done(null, false, {message: 'No user found'});
            }
            bcrypt.compare(password, Member.password, function(err,isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, Member);
                } else {
                    return done(null, false, { message: 'Your password is wrong' });
                }
            });
        });
    }));

    passport.serializeUser(function (Member, done) {
        done(null, Member.id);
    });

    passport.deserializeUser(function (id, done) {
        member.findById(id, function (err, Member) {
            done(err, Member);
        });
    });
}