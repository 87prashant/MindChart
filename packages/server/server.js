const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors")
const bcrypt = require("bcryptjs")
const User = require("./model/user");

const app = express();

app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/userdatadb");

app.post("/register", function (req, res) {
  console.log(req.body)
  const {username, email, password} = req.body
  User.create({username, email, password})

});

app.listen(8000);
