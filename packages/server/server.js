const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./model/user");
const UserData = require("./model/userdata")
require("dotenv").config({ path: "../../.env" })

const app = express();

app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());
app.use(cors());

if (!process.env.MONGODB_URI) throw Error("MONGODB_URI is empty!!!");

mongoose.connect(process.env.MONGODB_URI)

app.post("/register", async function (req, res) {
  const { username, email, password: plainPassword } = req.body;
  if (!plainPassword || !email || !username) {
    return res.json({ status: "error", error: "All fields are compulsory" });
  }
  if (username.length < 5) {
    return res.json({
      status: "error",
      error: "Username should be at least 5 symbol long",
    });
  }
  if (plainPassword.length < 8) {
    return res.json({
      status: "error",
      error: "Password should be at least 8 symbol long",
    });
  }
  const password = await bcrypt.hash(plainPassword, 10);
  try {
    const response = await User.create({ username, email, password });
    console.log(response);
  } catch (error) {
    if (error.code === 11000)
      return res.json({
        status: "error",
        error: "Email is already registered",
      });
    throw error;
  }
  createUserData(email)
  return res.json({ status: "ok", username, email });
});

app.post("/login", async function (req, res) {
  const { email, password: plainPassword } = req.body;
  if (!plainPassword || !email) {
    return res.json({ status: "error", error: "All fields are compulsory" });
  }
  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.json({ status: "error", error: "User not found" });
  }
  if (await bcrypt.compare(plainPassword, user.password)) {
    const { username, email } = user;
    return res.json({ status: "ok", username, email });
  }
  getUserData(email)
  return res.json({ status: "error", error: "Incorrect Password" });
});

async function createUserData(email) {
  await UserData.create([{email}])
}

async function getUserData(email) {
  const userData = await UserData.findOne({email}).lean()
  console.log(userData)
}

app.listen(8000);
