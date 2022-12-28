const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./model/user");
const UserData = require("./model/userdata");
const logger = require("./logger");
const mailSender = require("./mailSender");
const React = require("react")
const ReactDOMServer = require("react-dom/server");
const RegistrationMail = require("./build/RegistrationMail");

const app = express();

require("dotenv").config({ path: "../../.env" });
app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());
app.use(cors());

if (!process.env.MONGODB_URI) {
  logger("MONGODB_URI is empty!!!", "ERROR");
  return;
}

try {
  mongoose.connect(process.env.MONGODB_URI);
} catch (error) {
  logger(error, "ERROR");
  return;
}

async function createUserData(email) {
  const userData = await UserData.create({ email, data: [] });
  logger(`New user registered: \n${userData}`, "INFO");
}

async function getUserData(email) {
  return (await UserData.findOne({ email }).lean()).data;
}

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

  const user = await User.findOne({ email }).lean();
  if (user) {
    return res.json({
      status: "error",
      error: "Email is already registered",
    });
  } else {
    try {
      await mailSender({
        to: email,
        subject: "Registration Mail",
        message: new RegistrationMail({username, email, password})
      });
    } catch (error) {
      logger(error, "ERROR");
      return res.json({status: "error", error: "Server Error"})
    }
  }
  return res.json({ status: "ok", body: "Verify the Email" });
});

app.post("/verify-email", async function (req, res) {
  const { username, email, password } = req.body;

  try {
    await User.create({ username, email, password });
  } catch (error) {
    logger(error, "ERROR");
    return res.json({ status: "error", error: "Server Error" });
  }
  createUserData(email);
  return res.json({ status: "ok" });
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
    const userData = await getUserData(email);
    logger(`User logged in: \n${user}`, "INFO");
    return res.json({
      status: "ok",
      userCredentials: { username, email },
      userData,
    });
  }
  return res.json({ status: "error", error: "Incorrect Password" });
});

app.post("/addData", async function (req, res) {
  const { email, formData } = req.body;
  await UserData.updateOne({ email }, { $addToSet: { data: formData } });
  return res.json({ status: "ok" });
});

app.post("/deleteData", async function (req, res) {
  const { email, toBeDeleted } = req.body;
  try {
    await UserData.updateOne(
      { email },
      {
        $pull: {
          data: {
            categories: toBeDeleted.categories,
            emotions: toBeDeleted.emotions,
            priority: toBeDeleted.priority,
            description: toBeDeleted.description,
          },
        },
      }
    );
  } catch (error) {
    logger(error, "ERROR");
    return;
  }
  return res.json({ status: "ok" });
});

app.listen(8000);
