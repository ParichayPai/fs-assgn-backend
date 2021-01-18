const passport = require('passport');
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;


module.exports = function (passport) {
    passport.use(
      new localStrategy((username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
          if (err) throw err;
          if (!user) return done(null, false);
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) throw err;
            if (result === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        });
      })
    );

// module.exports = function (passport){
//     passport.use(new LocalStrategy(
//         function(username, password, done) {
//             User.findOne({ username: username }, function (err, user) {
//                 if (err) 
//                     return done(err);
//                 if (!user) 
//                     return done(null, false);
//                 bcrypt.compare(password, user.password, (err, result) => {
//                     if (err) throw err;
//                     if (result === true) {
//                         return done(null, user);
//                     } else {
//                         return done(null, false);
//                     }
//                 });
//                 return done(null, user);
//             });
//         }
//     ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser((_id, done) => {
      User.findById( _id, (err, user) => {
        if(err){
            done(null, false, {error:err});
        } else {
            done(null, user);
        }
      });
    });
}

