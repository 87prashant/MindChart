const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const User = require("./model/user");

const app = express();

app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());

async function connection() {
  mongoose.connect("mongodb://localhost:27017/userCredentials");
}

app.post("/register", async function (req, res) {
  
  res.json("it is working...");
});

app.listen(8000);
