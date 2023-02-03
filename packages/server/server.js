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
const generateUniqueVerificationToken = require("./generateUniqueVerificationToken");
const registrationMailString = require("./build/RegistrationMail");
const forgetPasswordMailString = require("./build/ForgetPasswordMail");
const {
  Error,
  Message,
  LogLevel,
  AccountStatus,
  ResponseStatus,
  DataOperation,
} = require("./constants");

const app = express();

require("dotenv").config({ path: "../../.env" });
app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());
app.use(cors());

const fiveMinutes = 1000 * 300;

if (!process.env.MONGODB_URI) {
  logger(Error.EMPTY_MONGODB_URI, LogLevel.ERROR);
  return;
}

try {
  mongoose.connect(process.env.MONGODB_URI);
} catch (error) {
  logger(error, LogErrorLevel.ERROR);
  return;
}

async function createUserData(email) {
  await UserData.create({ email, data: [] });
  logger(Message.NEW_USER_ADDED, LogLevel.INFO);
}

async function getUserData(email) {
  return (await UserData.findOne({ email }).lean()).data;
}

function removeAccount(email) {
  setTimeout(async () => {
    try {
      await User.deleteOne({
        $and: [{ email }, { status: AccountStatus.UNVERIFIED }],
      });
    } catch (error) {
      logger(error, LogLevel.ERROR);
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
      logger(error, LogLevel.ERROR);
    }
  }, fiveMinutes);
}

/**
 * @api Register user
 */
app.post("/register", async function (req, res) {
  const { username, email, password: plainPassword } = req.body;

  if (!plainPassword || !email || !username) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: Error.ALL_FIELDS_COMPULSORY,
    });
  }
  if (username.length < 5) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: Error.SHORT_USERNAME,
    });
  }
  if (plainPassword.length < 8) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: Error.SHORT_PASSWORD,
    });
  }

  const user = await User.findOne({ email }).lean();
  const password = await bcrypt.hash(plainPassword, 10);
  const verificationToken = generateUniqueVerificationToken();
  const createdAt = new Date();
  const uniqueUrl = `${process.env.ORIGIN}/verify-email/${email}/${verificationToken}`;
  const status = AccountStatus.UNVERIFIED;

  if (user) {
    if (user.status === AccountStatus.UNVERIFIED) {
      try {
        await User.updateOne(
          { email },
          { $set: { username, password, verificationToken } }
        );
        removeAccount(email);
      } catch (error) {
        logger(error, LogLevel.ERROR);
        return res.json({
          status: ResponseStatus.ERROR,
          error: Error.SERVER_ERROR,
        });
      }
    } else {
      return res.json({
        status: ResponseStatus.ERROR,
        error: Error.ALREADY_REGISTERED,
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
      logger(error, LogLevel.ERROR);
      return res.json({
        status: ResponseStatus.ERROR,
        error: Error.SERVER_ERROR,
      });
    }
  }

  const html = registrationMailString({ username, uniqueUrl });
  try {
    await mailSender({
      to: email,
      subject: Message.VERIFICATION_MAIL,
      message: html,
    });
  } catch (error) {
    logger(error, LogLevel.ERROR);
    return res.json({
      status: ResponseStatus.ERROR,
      //EENVELOPE not working. Why?
      error:
        error.code === "EENVELOPE" ? Error.INVALID_EMAIL : Error.SERVER_ERROR,
    });
  }

  return res.json({
    status: ResponseStatus.ERROR,
    error: Error.VERIFICATION_EMAIL,
  });
});

/**
 * @api verify email
 */
app.post("/verify-email", async function (req, res) {
  const { email, verificationToken } = req.body;

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: Error.NOT_REGISTERED,
    });
  }
  if (user.status !== AccountStatus.UNVERIFIED) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: Error.NOT_ALLOWED,
    });
  }
  if (user.verificationToken !== verificationToken) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: Error.INVALID_TOKEN,
    });
  }
  await User.updateMany(
    { email },
    { $unset: { verificationToken: "", status: "" } }
  );
  createUserData(email);
  return res.json({ status: ResponseStatus.OK, username: user.username });
});

/**
 * @api forger password
 */
app.post("/forget-password", async function (req, res) {
  const { email } = req.body;
  if (!email.trim()) {
    return res.json({ status: ResponseStatus.ERROR, error: Error.EMPTY_MAIL });
  }

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: Error.NOT_REGISTERED,
    });
  }
  if (user.status === AccountStatus.UNVERIFIED) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: Error.NOT_VERIFIED,
    });
  }

  const verificationToken = generateUniqueVerificationToken();
  const uniqueUrl = `${process.env.ORIGIN}/forget-password-verify/${email}/${verificationToken}`;

  const html = forgetPasswordMailString({ username: user.username, uniqueUrl });
  try {
    await mailSender({
      to: email,
      subject: Message.FORGET_PASSWORD_MAIL,
      message: html,
    });
  } catch (error) {
    logger(error, LogLevel.ERROR);
    return res.json({
      status: ResponseStatus.ERROR,
      error:
        error.code === "EENVELOPE" ? Error.INVALID_EMAIL : Error.SERVER_ERROR,
    });
  }

  try {
    await User.updateMany(
      { email },
      {
        $set: { status: AccountStatus.FORGET_PASSWORD, verificationToken },
      }
    );
    removeToken(email);
  } catch (error) {
    logger(error, LogLevel.ERROR);
    return res.json({
      status: ResponseStatus.ERROR,
      error: Error.SERVER_ERROR,
    });
  }

  return res.json({
    status: ResponseStatus.ERROR,
    error: Error.FORGET_PASSWORD_MAIL,
  });
});

/**
 * @api forget password verify
 */
app.post("/forget-password-verify", async function (req, res) {
  const { email, verificationToken, password: plainPassword } = req.body;

  if (plainPassword.length < 8) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: Error.SHORT_PASSWORD,
    });
  }

  const user = await User.findOne({ email }).lean();

  if (!user) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: Error.NOT_REGISTERED,
    });
  }

  if (!user.status) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: Error.NOT_ALLOWED,
    });
  } else if (user.status == AccountStatus.UNVERIFIED) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: Error.NOT_VERIFIED,
    });
  } else {
    if (user.verificationToken !== verificationToken) {
      return res.json({
        status: ResponseStatus.ERROR,
        error: Error.INVALID_TOKEN,
      });
    }

    const password = await bcrypt.hash(plainPassword, 10);
    await User.updateMany(
      { email },
      { $unset: { status: "", verificationToken: "" } }
    );
    await User.updateMany({ email }, { $set: { password: password } }); // why not working in one query?
    const userData = await getUserData(email);

    return res.json({
      status: ResponseStatus.OK,
      username: user.username,
      userData,
    });
  }
});

/**
 * @api login user
 */
app.post("/login", async function (req, res) {
  const { email, password: plainPassword } = req.body;

  if (!plainPassword || !email) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: Error.ALL_FIELDS_COMPULSORY,
    });
  }

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: Error.NOT_REGISTERED,
    });
  }
  if (user.status === AccountStatus.UNVERIFIED) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: Error.NOT_VERIFIED,
    });
  }
  if (await bcrypt.compare(plainPassword, user.password)) {
    const { username, email } = user;
    const userData = await getUserData(email);
    return res.json({
      status: ResponseStatus.OK,
      userCredentials: { username, email },
      userData,
    });
  }
  return res.json({
    status: ResponseStatus.ERROR,
    error: Error.INCORRECT_PASSWORD,
  });
});

/**
 * @api modify user data
 */
app.post("/modify-data", async function (req, res) {
  //currently there is no immutable field in nodeData to find required nodeData. So need to send the two nodeData to distinguish between the oldNodeData to be deleted and newNodeData to be added
  const {
    email,
    toBeAdded: newNodeData,
    toBeDeleted: oldNodeData,
    operation,
  } = req.body;

  const addData = async () => {
    await UserData.updateOne({ email }, { $addToSet: { data: newNodeData } });
  };

  const deleteData = async () => {
    await UserData.updateOne(
      { email },
      {
        $pull: {
          data: oldNodeData,
        },
      }
    );
  };

  try {
    if (operation === DataOperation.ADD) {
      addData();
    } else if (operation === DataOperation.DELETE) {
      deleteData();
    } else {
      deleteData();
      addData();
    }
    return res.json({ status: ResponseStatus.OK });
  } catch (error) {
    logger(error, LogLevel.ERROR);
  }
});

app.listen(8000);
