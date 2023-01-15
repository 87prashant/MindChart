//TODO: Create enum for type of statuses of user
//TODO: Create enum for type of errors generated
//TODO: Create enum for general messages
//TODO: Create just one API to add and delete or modify userdata

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
const generateUniqueVerificationToken = require("./build/generateUniqueVerificationToken");
const registrationMailString = require("./build/RegistrationMail");
const forgetPasswordMailString = require("./build/ForgetPasswordMail");

const app = express();

require("dotenv").config({ path: "../../.env" });
app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());
app.use(cors());

const fiveMinutes = 1000 * 300

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

function removeAccount(email) {
  setTimeout(async () => {
    try {
      await User.deleteOne({
        $and: [{ email }, { status: "Unverified" }],
      });
      console.log("removed");
    } catch (error) {
      logger(error, "ERROR");
    }
  }, fiveMinutes);
}

function removeToken(email) {
  setTimeout(async () => {
    try {
      await User.updateOne(
        { email },
        {
          $unset: {
            verificationToken: "",
            status: "",
          },
        }
      );
    } catch (error) {
      logger(error, "ERROR");
    }
  }, fiveMinutes);
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

  const user = await User.findOne({ email }).lean();
  const password = await bcrypt.hash(plainPassword, 10);
  const verificationToken = generateUniqueVerificationToken();
  const createdAt = new Date();
  const uniqueUrl = `${process.env.ORIGIN}/verify-email/${email}/${verificationToken}`;
  const status = "Unverified";

  if (user) {
    if (user.status === "Unverified") {
      try {
        await User.updateOne(
          { email },
          { $set: { username, password, verificationToken } }
        );
        removeAccount(email);
      } catch (error) {
        logger(error, "ERROR");
        return res.json({ status: "error", error: "Error on our end" });
      }
    } else {
      return res.json({
        status: "error",
        error: "Email is already registered",
      });
    }
  } else {
    try {
      await User.create({
        username,
        email,
        password,
        createdAt,
        status,
        verificationToken,
      });
      removeAccount(email);
    } catch (error) {
      logger(error, "ERROR");
      return res.json({ status: "error", error: "Error on our end" });
    }
  }

  const html = registrationMailString({ username, uniqueUrl });
  try {
    await mailSender({
      to: email,
      subject: "Verification Mail",
      message: html,
    });
  } catch (error) {
    logger(error, "ERROR");
    return res.json({
      status: "error",
      error: error.code === "EENVELOPE" ? "Invalid Email" : "Error on our end",
    });
  }

  return res.json({ status: "error", error: "Verify the Email" });
});

app.post("/verify-email", async function (req, res) {
  const { email, verificationToken } = req.body;

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.json({
      status: "error",
      error: "You are not Registered",
    });
  }
  if (user.status !== "Unverified") {
    return res.json({ status: "error", error: "You are already Verified" });
  }
  if (user.verificationToken !== verificationToken) {
    return res.json({
      status: "error",
      error: "Invalid verification token, or you are already verified",
    });
  }
  await User.updateMany(
    { email },
    { $unset: { verificationToken: "", status: "" } }
  );
  createUserData(email);
  return res.json({ status: "ok", username: user.username });
});

app.post("/forget-password", async function (req, res) {
  const { email } = req.body;
  if (!email.trim()) {
    return res.json({ status: "error", error: "Email is empty" });
  }

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.json({ status: "error", error: "You are not registered" });
  }
  if (user.status === "Unverified") {
    return res.json({ status: "error", error: "You are not verified" });
  }

  const verificationToken = generateUniqueVerificationToken();
  const uniqueUrl = `${process.env.ORIGIN}/forget-password-verify/${email}/${verificationToken}`;

  const html = forgetPasswordMailString({ username: user.username, uniqueUrl });
  try {
    await mailSender({
      to: email,
      subject: "Forget Password Mail",
      message: html,
    });
  } catch (error) {
    logger(error, "ERROR");
    return res.json({
      status: "error",
      error: error.code === "EENVELOPE" ? "Invalid Email" : "Error on our end",
    });
  }

  try {
    await User.updateMany(
      { email },
      {
        $set: { status: "Forget_Password", verificationToken },
      }
    );
    removeToken(email);
  } catch (error) {
    logger(error, "ERROR");
    return res.json({ status: "error", error: "Error on our end" });
  }

  return res.json({
    status: "error",
    error: "Mail sent to generate new Password",
  });
});

app.post("/forget-password-verify", async function (req, res) {
  const { email, verificationToken, password: plainPassword } = req.body;

  if (plainPassword.length < 8) {
    return res.json({
      status: "error",
      error: "Password should be at least 8 symbol long",
    });
  }

  const user = await User.findOne({ email }).lean();

  if (!user) {
    return res.json({
      status: "error",
      error: "You are not Registered",
    });
  }

  if (!user.status) {
    return res.json({
      status: "error",
      error: "You are not allowed",
    });
  } else if (user.status == "Unverified") {
    return res.json({
      status: "error",
      error: "You are not verified",
    });
  } else {
    if (user.verificationToken !== verificationToken) {
      return res.json({
        status: "error",
        error: "Invalid verification token",
      });
    }
    const password = await bcrypt.hash(plainPassword, 10);
    await User.updateMany(
      { email },
      { $unset: { status: "", verificationToken: "" } }
    );
    // why not working in one query?
    await User.updateMany({ email }, { $set: { password: password } });
    return res.json({ status: "ok", username: user.username });
  }
});

app.post("/login", async function (req, res) {
  const { email, password: plainPassword } = req.body;

  if (!plainPassword || !email) {
    return res.json({ status: "error", error: "All fields are compulsory" });
  }

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.json({
      status: "error",
      error: "You are not found, Register first",
    });
  }
  if (user.status === "Unverified") {
    return res.json({
      status: "error",
      error: "You are not verified. Verify or Register again",
    });
  }
  if (await bcrypt.compare(plainPassword, user.password)) {
    const { username, email } = user;
    const userData = await getUserData(email);
    return res.json({
      status: "ok",
      userCredentials: { username, email },
      userData,
    });
  }
  return res.json({ status: "error", error: "Incorrect Password" });
});

app.post("/modify-data", async function (req, res) {
  //currently there is no immutable field in formData to find required formData. So need to send the two formData to distinguish between the oldFormData to be deleted and newFormData to be added
  const {
    email,
    toBeAdded: newFormData,
    toBeDeleted: oldFormData,
    operation,
  } = req.body;

  const addData = async () => {
    await UserData.updateOne({ email }, { $addToSet: { data: newFormData } });
  };

  const deleteData = async () => {
    await UserData.updateOne(
      { email },
      {
        $pull: {
          data: oldFormData,
        },
      }
    );
  };

  try {
    if (operation === "Add") {
      addData();
    } else if (operation === "Delete") {
      deleteData();
    } else {
      deleteData();
      addData();
    }
    return res.json({ status: "ok" });
  } catch (error) {
    logger(error, "ERROR");
  }
});

app.listen(8000);
