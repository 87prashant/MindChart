const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors")
const User = require("./model/user");

const app = express();

app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());
app.use(cors());

async function connection() {
  mongoose.connect("mongodb://localhost:27017/userdatadb");
}

app.post("/register", function (req, res) {
  User.create()
  res.json({"h":"it is working..."});
});

app.listen(8000);
