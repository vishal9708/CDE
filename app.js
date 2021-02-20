const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");

app.set('view engine','ejs');

app.use(express.static('public'));

app.get("/",function(req,res){
  res.render("home");
});
app.get("/home",function(req,res){
  res.render("home");
});

app.get("/about",function(req,res){
  const about = "About Me";
  res.render("about", {pageName: about});
});
app.get("/blog",function(req,res){
  const blog ="Blog";
  res.render("blog", {pageName: blog});
});
app.get("/contact",function(req,res){
  const contact= "Contact Us";
  res.render("contact", {pageName: contact});
});
app.get("/service",function(req,res){
  const services = "Our Services";
  res.render("service", {pageName:services});
});
app.get("/team",function(req,res){
  const team = "Our Team";
  res.render("team", {pageName:team});
});
app.get("/404",function(req,res){
  res.render("404");
});
app.get("/blogpost",function(req,res){
  const blogpost = "Post";
  res.render("single-post", {pageName:blogpost});
});
app.get("/login",function(req,res){
  const blogpost = "Post";
  res.render("login", {pageName:blogpost});
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server started at port 3000.")
});
