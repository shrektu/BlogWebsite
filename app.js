//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const {dbLink} = require("./db")

const homeStartingContent = "Welcome to my blog website. The front-end of this website was made using ejs templates and to make the back-end I used node.js with express. The post entries are saved to Mongo database which is hosted on AWS servers. Feel free to fork my repo on ";
const homeStartingContentFinish = " and add new functionalities or fix bugs if there are any. If you encounter a bug, go to contact section and feel free to message me."
const aboutContent = "My name's Sebastian and I'm 20yo. I'm a student and in my free time I learn programming, especially in Web Development sector for the time of creating this website.";
const contactContent = "Feel free to contact me on my ";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect(dbLink);

const postSchema = {
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      endingContent: homeStartingContentFinish,
      posts: posts
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  })

  post.save(function(err){
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log("Server started succesfully!");
});