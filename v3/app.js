var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp_v3", {useNewUrlParser: true, useUnifiedTopology: true});
seedDB();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.get("/",function(req,res){
    res.render("landing");
});

// =================Campgrounds Routes=====================

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

app.post("/campgrounds", function(req, res){
    Campground.create(req.body.campground, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/:id/edit", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

app.put("/campgrounds/:id", function(req, res){
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

app.delete("/campgrounds/:id", function(req, res){
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


// ===================Comments Routes==========================


app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            console.log(campground);
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
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
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});



app.listen("3000",function(req, res){
    console.log("Server is listening at http://localhost:3000");
});