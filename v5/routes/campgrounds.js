var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

// =================Campgrounds Routes=====================

router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

router.post("/", isLoggedIn, function(req, res){
    Campground.create(req.body.campground, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            campground.author.id = req.user._id;
            campground.author.username = req.user.username;
            campground.save();  //saving is important bro
            console.log(campground);
            res.redirect("/campgrounds");
        }
    });
});

router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

router.put("/:id", checkCampgroundOwnership, function(req, res){
    // res.send("Successfully Updated!!");
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:id", checkCampgroundOwnership, function(req, res){
    // res.send("Delete Requested!!");
    Campground.findByIdAndRemove(req.params.id, function(err, deletedCampground){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});


function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campground){
            if(err){
                console.log(err);
                res.redirect("back");
            }
            else{
                if(campground.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    console.log("Not authorized!");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        console.log("Not signed in!")
        res.redirect("/login");
    }
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;