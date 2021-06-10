var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// ===================Comments Routes==========================

router.get("/new",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            console.log(req.user);
            console.log(campground);
            res.render("comments/new", {campground: campground});
        }
    });
});

router.post("/", function(req, res){
    // res.send("your comment will be added soon.");
    Comment.create(req.body.comment, function(err, comment){
        if(err){
            console.log(err);
        }
        else{
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err){
                    console.log(err);
                }
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;