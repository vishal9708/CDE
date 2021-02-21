const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

//packages for sessions
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

//packages for images
var multer = require('multer');
var fs = require('fs');
var path = require('path');
const { Console } = require("console");
const { use } = require("passport");
const { identity } = require("lodash");


//app.use code
const app = express() ;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

///////////////////////login sign-up session set-up starts here////////////////////////////////

// const secret = "this is a strong secret";
// userSchema.plugin(encrypt,{secret : secret , encryptedFields : ["password"]});

app.use(session({
  secret : "this is a strong secret",
  resave : false,
  saveUninitialized :false
}));
app.use(passport.initialize());
app.use(passport.session());


///////////////////////login sign-up session set-up ends here////////////////////////////////




mongoose.connect("mongodb://localhost:27017/CareerDreamEducation",  {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
mongoose.set("useCreateIndex",true);

// mongoose.connect("mongodb+srv://admin-yogesh:iamyogesh@cluster0.wpl3x.mongodb.net/cdewebDB",  {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false
// });


///////////////////////basic login sign-up pages starts here////////////////////////////////

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/base", function(req, res) {
  const base = "base"
  res.render("base",{pageName:base});
});

app.get("/register", function(req, res) {
  const register = "register"
  res.render("register",{pageName:register});
});


app.get("/compose",function(req,res){
if(req.isAuthenticated())
{
  res.render("compose",{pageName:compose});
}
else
{
  res.redirect("/login");
}
});
app.post("/register", function(req, res) { if(req.body.invitationcode==="CDE5242"){
  User.register({username:req.body.username}, req.body.password, function(err, user) {
    if (err) 
    {
    
      res.redirect("/regiter");
    }
  
    else{
     
      passport.authenticate("local")(req,res,function(){
        res.redirect("/compose");
      });
        
    }
    
  });
   }     });
  
app.get("/login", function(req, res) {
  const login = "Login"
  res.render("login",{pageName:login});
});


app.post("/login", function(req, res) {
 
  const user = new User({
     username : req.body.username,
     password : req.body.password
  });
  req.login(user,function(err)
  {
    if(err)
    {
      Console.log(err);
    }
    else
    {
      passport.authenticate("local")(req,res,function(){
        res.redirect("/compose");
      });
    }

  });
});


app.get("/logout",function(req,res){
req.logout();
res.redirect("/");
});

///////////////////////basic login sign-up pages ends here/////////////////////////////////////////////////////

///////////////////////blog-post pages starts here/////////////////////////////////////////////////////
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "./public/images/")
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '_' + Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({
storage: storage }).single("file");

const postSchema = new mongoose.Schema({
  postImage:
   {
       data: Buffer,
       contentType: String
   },
  postTitle: String,
  postBody: String

});
const Post = mongoose.model("Post", postSchema);


// app.get("/posts/:newpostparameter", function(req, res) {
//   let checkparameterId = req.params.newpostparameter;

//   Post.findOne({ _id : checkparameterId }, function(err, foundPost) {
//     if (!err) {

//         res.render("single-post", {
//           postInejs: foundPost
//         });
//     }
//   });

// });

app.post("/compose",upload, function(req, res) {

  if (req.isAuthenticated){
    res.render("compose");}

    else{
      res.render("login");
    }
  const newPost = new Post({
    postImage : {
      data: fs.readFileSync(path.join(__dirname + '/public/images/' + req.file.filename)),
      contentType: 'image/png/jpg'
    },
    postTitle: req.body.postTitle,
    postBody: req.body.postBody
  });

 if(req.body.postBody.length>0)
  {newPost.save();}

  res.redirect("/");
});


///////////////////////blog-post pages ends here/////////////////////////////////////////////////////


// get method starts here
app.get("/", function(req, res) {
  Post.find({}, function(err, foundPosts) {
    if (!err) 
    { let totalposts = foundPosts.length;
      
      res.render("home", {
        lastPostInejs: foundPosts[totalposts-1],
        secondlastPostInejs: foundPosts[totalposts-2],
        thirdlastPostInejs: foundPosts[totalposts-3]
      });
    }
  });
});
app.get("/onepage-slider", function(req, res) {
  const onepageslider ="onepage-slider";
  res.render("onepage-slider",{pageName:onepageslider});
});

app.get("/onepage-text", function(req, res) {
  res.render("onepage-text");
});

app.get("/about", function(req, res) {
  const about = "About";
  res.render("about",{pageName:about});
});

app.get("/service", function(req, res) {
  const service = "Service";
  res.render("service",{pageName:service});
});

app.get("/portfolio", function(req, res) {
  const index ="portfolio";
  res.render("portfolio",{pageName:portfolio})
});

app.get("/team", function(req, res) {
  const team ="team";
  res.render("team",{pageName:team})
});

app.get("/pricing", function(req, res) {
  const pricing ="pricing";
  res.render("pricing",{pageName:pricing})
});

app.get("/contact", function(req, res) {
  const contact ="Contact";
  res.render("contact",{pageName:contact})
});

app.get("/404", function(req, res) {
  res.render("404");
});

app.get("/blog", function(req, res) {
  Post.find({}, function(err, foundPosts) {
    if (!err) {
      const blog = "Blog";
      res.render("blog", {
        postsInejs: foundPosts,
        pageName: blog
      });
    }
  });
});

// app.get("/posts/:newpostparameter", function(req, res) {
//   var checkId = req.params.newpostparameter;
 
//   Post.findOne({ _id : checkId }, function(err, foundPost) {
//     if (!err) 
//     {

//         res.render("post", {
//           postInejs : foundPost
//         });
//     }
//   });

// });

var singleBlogId = "";
app.post("/single-blog", function(req, res) {
  singleBlogId = req.body.singleblogid ;
 
  res.redirect("/single-blog");
});
app.get("/single-blog", function(req, res) {
  Post.findOne({ _id : singleBlogId}, function(err, foundPost) {
        if (!err) 
        {
           const singleBlog = "Single Blog"
            res.render("single-blog", {
              postInejs : foundPost,
              pageName: singleBlog
            });
        }
      });
});


app.get("/index", function(req, res) {
  const index ="index";
  res.render("index",{pageName:index})
});

app.get("/index-text", function(req, res) {
  const indextext = "Index text";
  res.render("index-text", {pageName:indextext});
});

let port = process.env.PORT;
if(port == null || port =="")
{
  port = 3000;
}

app.listen(port, function() {
  console.log(`server running  on port ${port}`);
});