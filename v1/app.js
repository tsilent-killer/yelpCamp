var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/",function(req,res){
    res.render("landing");
});

var campgrounds = [
    {name: "Winterfell", image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGNhbXBncm91bmR8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"},
    {name: "King's Landing", image: "https://images.unsplash.com/photo-1515444744559-7be63e1600de?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y2FtcGdyb3VuZHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"}, 
    {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1482355347028-ff60443f60fe?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzh8fGNhbXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"}
];
app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.post("/campgrounds", function(req, res){
    campgrounds.push({name: req.body.name, image: req.body.image});
    res.redirect("campgrounds");
});

app.listen("3000",function(req, res){
    console.log("Server is listening at http://localhost:3000");
});