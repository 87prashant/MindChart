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

app.post("/register", async function (req, res) {
  const {username, email, password: plainPassword} = req.body
  const password = await bcrypt.hash(plainPassword, 10)
  try {
    const response = await User.create({username, email, password})
    console.log(response)
  } catch(error) {
    console.log("Error occurred...", error)
    return res.json({status: "error"})
  }
});

app.listen(8000);
