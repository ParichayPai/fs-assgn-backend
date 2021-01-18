const mongoose = require("mongoose");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const {url} = require("./config/keys");
const Post = require("./models/post");
const Comment = require("./models/comment");
const User = require("./models/user");


mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(r => console.log("routing"))
    .catch(err => console.log("couldn't connect ", err));
module.exports = (app) => {

    // app.post("/api/v1/login",
    //     (req, res, next) => {
    //         passport.authenticate("local", (err, user, next) => {
    //             if (err) {
    //                 throw err;
    //             }
    //             if (!user) {
    //                 res.send("No User Exists");
    //             }
    //             else {
    //                 req.login(user, (err) => {
    //                     if (err){
    //                         console.log(err);
    //                     } else {
    //                         // res.send("Successfully Authenticated");
    //                         console.log(req.user);
    //                     }
    //                 });
    //             }
    //         })(req, res, next);
    //     }
    // );
    app.post('/api/v1/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
          if (err) 
            return next(err); 
          if (!user) 
            return res.status(404).send("No User Exists");
          else{
            req.logIn(user, (err) => {
                if (err) throw err;
                res.send("Successfully Authenticated");
                // console.log(req.user);
              });
          }
        })(req, res, next);
      });

    app.post("/api/v1/register", (req, res) => {
        User.findOne({ username: req.body.username }, async (err, doc) => {
            if (err) throw err;
            if (doc) res.send("User Already Exists");
            if (!doc) {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);

                const newUser = new User({
                    username: req.body.username,
                    password: hashedPassword,
                });
                await newUser.save();
                res.send("User Created");
            }
        });
    });
    app.get("/api/v1/user", (req, res) => {
        res.send(req.user);
    });
    app.get('/api/v1/logout', function (req, res){
        req.session.destroy();
    });
    // app.get('/api/v1/logout', function(req, res){
    //     console.log('logout')
    //     console.log(res.data);
    //     req.logOut();
    //     // res.redirect('/');
    // });
////////////////////Passport Shit Done///////////////////////////////////

    app.get('/api/v1/posts', (req, res) => {
        Post.find().then((post) => res.send(post));
    });

    app.post("/api/v1/posts", (req, res) => {
        let IncomingPost = new Post({
            title: req.body["title"],
            username: req.body["username"],
            description: req.body["description"],
        });
        IncomingPost.save().then(data => {
            console.log("post Added");
            res.send(data);
        }).catch(err => {
            throw err;
        });
    });

    app.get("/api/v1/getComments/:id", (req, res) => {
        Comment.find({postId:req.params.id}).then(comment => res.send(comment));
    });

    app.post("/api/v1/postComment", (req, res) => {
        let IncomingComment = new Comment({
            postId: req.body.postId,
            username: req.body.userName,
            description: req.body.commentData,
            timeStamp: new Date().toLocaleString()
        });
        IncomingComment.save().then(data => {
            console.log("comment posted");
            res.send(data);
        }).catch(err => {
            throw err;
        });
    })
}
