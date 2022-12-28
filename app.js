//jshint esversion:6
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const dotenv = require('dotenv').config();

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const contentSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Journal = mongoose.model("Journal", contentSchema);

app.get("/", function(req, res) {
  Journal.find({}, function(err, result) {
    if (!err) {
      res.render("journals", {homeStartingContent: homeStartingContent, posts: result});
    }
  });
});

app.get("/posts/:day", function(req, res) {
  Journal.findOne({title: req.params.day}, function(err, result) {
    if (!err) {
      res.render("post", {title: result.title, content: result.content});
    }
  });
});

app.get("/about", function(req, res) {
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res) {
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.get("/failure", function(req, res) {
  res.render("failure");
});

app.get("/delete", function(req, res) {
  Journal.find({}, function(err, result) {
    if (!err) {
      res.render("delete", {posts: result});
    }
  });
});

app.get("/gone", function(req, res) {
  res.render("gone");
});

app.post("/compose", function(req, res) {
  if (_.lowerCase(req.body.title) === "") {
    res.redirect("/failure");
  } else {
    const post = new Journal({
      title: req.body.title,
      content: req.body.composition
    });
    post.save(function(err) {
      if (!err) {
        res.redirect("/");
      }
    });
  }
});

app.post("/failure", function(req, res) {
  res.redirect("/compose");
});

app.post("/delete", function(req, res) {
  let size = Object.keys(req.body).length;
  if (size > 1) {
    Journal.find({}, function(err, result) {
      for (var i = 0; i < result.length; i++) {
        for (var c in req.body) {
          if (result[i].title === c) {
            Journal.findOneAndDelete({title: c}, function(err) {});
            break;
          }
        }
      }
    });
    res.redirect("/gone");
  } else {
    res.redirect("/delete");
  }
});

const port = process.env.PORT || 3000;


app.listen(port, function() {
  console.log("Server is up and running.");
});
