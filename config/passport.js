const LocalStrategy = require('passport-local').Strategy;
const member = require('../models/member');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
    passport.use(new LocalStrategy(function(username, password, done){
        let query = {username: username};
        member.findOne(query, function(err, member){
            if(err) throw err;
            if(!member){
                return done(null, false, {message: 'No user found'});
            }
            bcrypt.compare(password, member.password, function(err,isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, member);
                } else {
                    return done(null, false, { message: 'Your password is wrong' });
                }
            });
        });
    }));

    passport.serializeUser(function (member, done) {
        done(null, member.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, member) {
            done(err, member);
        });
    });
}