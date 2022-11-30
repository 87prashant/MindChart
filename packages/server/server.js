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
  if(plainPassword.length < 6) {
    return res.json({status: "error", error: "Password should be at least 5 symbol long"})
  }
  const password = await bcrypt.hash(plainPassword, 10)
  try {
    const response = await User.create({username, email, password})
    console.log(response)
  } catch(error) {
    if(error.code === 11000) 
      return res.json({status: "error", error: "Email is already registered"})
    throw error
  }
});

app.listen(8000);
