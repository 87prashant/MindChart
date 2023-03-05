/**
 * Apis:
 * 1. Register user
 * 2. Registered user verification
 * 3. Forget password
 * 4. Forget password verification
 * 5. Login
 * 6. Modify user data
 */

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
  ErrorMessage,
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
const fifteenSeconds = 1000 * 15;

if (!process.env.MONGODB_URI) logger(ErrorMessage.EMPTY_MONGODB_URI, LogLevel.ERROR);

mongoose.connect(process.env.MONGODB_URI, (error) => {
  if (error) logger(ErrorMessage.DATABASE_NOT_CONNECTED, LogLevel.ERROR, error);
  else logger(Message.CONNECTED_DATABASE, LogLevel.INFO);
});

// Create new user empty data
async function createUserData(email, session) {
  try {
    await UserData.create([{ email, data: [] }], { session });
  } catch (error) {
    logger(ErrorMessage.UNABLE_TO_CREATE_USERDATA, LogLevel.ERROR, error);
    throw error;
  }
}

// Fetch user data
async function getUserData(email) {
  try {
    const user = await UserData.findOne({ email }).lean();
    return user.data;
  } catch (error) {
    logger(ErrorMessage.UNABLE_TO_FIND_USERDATA, LogLevel.ERROR, error);
    throw error;
  }
}

// Remove unverified account after particular time
function removeAccount(email) {
  const timeoutId = setTimeout(async () => {
    try {
      await User.deleteOne({
        $and: [{ email }, { status: AccountStatus.UNVERIFIED }],
      });
    } catch (error) {
      logger(ErrorMessage.UNABLE_TO_REMOVE_USER, LogLevel.ERROR, error);
    }
  }, fiveMinutes);
  return timeoutId;
}

// Remove token after particular time
function removeToken(email) {
  const timeoutId = setTimeout(async () => {
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
      logger(ErrorMessage.UNABLE_TO_REMOVE_TOKEN, LogLevel.ERROR, error);
    }
  }, fiveMinutes);
  return timeoutId;
}

/**
 * @api Register user
 */
app.post("/register", async function (req, res) {
  const { username, email, password: plainPassword } = req.body;

  // Validation
  if (!plainPassword || !email || !username) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.ALL_FIELDS_COMPULSORY,
    });
  }
  if (username.length < 5) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SHORT_USERNAME,
    });
  }
  if (plainPassword.length < 8) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SHORT_PASSWORD,
    });
  }

  let user;
  try {
    user = await User.findOne({ email }).lean();
  } catch (error) {
    logger(ErrorMessage.UNABLE_TO_FIND_USER, LogLevel.ERROR, error);
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SERVER_ERROR,
    });
  }

  const password = await bcrypt.hash(plainPassword, 10);
  const verificationToken = generateUniqueVerificationToken();
  const createdAt = new Date();
  const uniqueUrl = `${process.env.ORIGIN}/verify-email/${email}/${verificationToken}`;
  const status = AccountStatus.UNVERIFIED;

  // Authorization and Registration
  // Start a session
  const session = await mongoose.startSession();
  session.startTransaction();

  let timeoutId = null;
  if (user) {
    if (user.status === AccountStatus.UNVERIFIED) {
      try {
        await User.updateOne(
          { email },
          { $set: { username, password, verificationToken } },
          { session }
        );
        timeoutId = removeAccount(email);
      } catch (error) {
        logger(ErrorMessage.UNABLE_TO_UPDATE_USER, LogLevel.ERROR, error);
        clearTimeout(timeoutId);

        await session.abortTransaction();

        return res.json({
          status: ResponseStatus.ERROR,
          error: ErrorMessage.SERVER_ERROR,
        });
      }
    } else {
      return res.json({
        status: ResponseStatus.ERROR,
        error: ErrorMessage.ALREADY_REGISTERED,
      });
    }
  } else {
    try {
      await User.create(
        [
          {
            username,
            email,
            password,
            createdAt,
            status,
            verificationToken,
          },
        ],
        { session }
      );
      timeoutId = removeAccount(email);
    } catch (error) {
      logger(ErrorMessage.UNABLE_TO_CREATE_USER, LogLevel.ERROR, error);
      clearTimeout(timeoutId);

      await session.abortTransaction();

      return res.json({
        status: ResponseStatus.ERROR,
        error: ErrorMessage.SERVER_ERROR,
      });
    }
  }

  // Send mail
  const html = registrationMailString({ username, uniqueUrl });
  try {
    await mailSender({
      to: email,
      subject: Message.VERIFICATION_MAIL,
      message: html,
    });

    await session.commitTransaction();

    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.VERIFICATION_MAIL,
    });
  } catch (error) {
    logger(ErrorMessage.UNABLE_TO_SEND_MAIL, LogLevel.ERROR, error);
    clearTimeout(timeoutId);

    await session.abortTransaction();

    return res.json({
      status: ResponseStatus.ERROR,
      //EENVELOPE not working. Why?
      error:
        error.code === "EENVELOPE" ? ErrorMessage.INVALID_EMAIL : ErrorMessage.SERVER_ERROR,
    });
  } finally {
    if (session) session.endSession();
  }
});

/**
 * @api Email verification
 */
app.post("/verify-email", async function (req, res) {
  const { email, verificationToken } = req.body;

  let user;
  try {
    user = await User.findOne({ email }).lean();
  } catch (error) {
    logger(ErrorMessage.UNABLE_TO_FIND_USER, LogLevel.ERROR, error);
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SERVER_ERROR,
    });
  }

  // Authorization
  if (!user) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.NOT_REGISTERED,
    });
  }
  if (user.status !== AccountStatus.UNVERIFIED) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.NOT_ALLOWED,
    });
  }
  if (user.verificationToken !== verificationToken) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.INVALID_TOKEN,
    });
  }

  // Update user as verified
  // Start a session
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await User.updateMany(
      { email },
      { $unset: { verificationToken: "", status: "" } }, // no status means verified
      { session }
    );
    await createUserData(email, session);

    await session.commitTransaction();

    logger(Message.VERIFY_SUCCESS.replace("#USEREMAIL#", user.email), LogLevel.INFO)
    return res.json({ status: ResponseStatus.OK, username: user.username });
  } catch (error) {
    logger(ErrorMessage.UNABLE_TO_UPDATE_USER, LogLevel.ERROR, error);

    await session.abortTransaction();

    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SERVER_ERROR,
    });
  } finally {
    if (session) session.endSession();
  }
});

/**
 * @api Forget password
 */
app.post("/forget-password", async function (req, res) {
  const { email } = req.body;

  // Validation
  if (!email.trim()) {
    return res.json({ status: ResponseStatus.ERROR, error: ErrorMessage.EMPTY_MAIL });
  }

  let user;
  try {
    user = await User.findOne({ email }).lean();
  } catch (error) {
    logger(ErrorMessage.UNABLE_TO_FIND_USER, LogLevel.ERROR, error);
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SERVER_ERROR,
    });
  }

  // Authorization
  if (!user) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.NOT_REGISTERED,
    });
  }
  if (user.status === AccountStatus.UNVERIFIED) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.NOT_VERIFIED,
    });
  }

  const verificationToken = generateUniqueVerificationToken();
  const uniqueUrl = `${process.env.ORIGIN}/forget-password-verify/${email}/${verificationToken}`;

  // Mark status as forget password
  // Start a session
  const session = await mongoose.startSession();
  session.startTransaction();

  let timeoutId = null;
  try {
    await User.updateMany(
      { email },
      {
        $set: { status: AccountStatus.FORGET_PASSWORD, verificationToken },
      },
      { session }
    );
    timeoutId = removeToken(email);
  } catch (error) {
    logger(ErrorMessage.UNABLE_TO_UPDATE_USER, LogLevel.ERROR, error);
    clearTimeout(timeoutId);

    await session.abortTransaction();

    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SERVER_ERROR,
    });
  }

  // Send mail
  const html = forgetPasswordMailString({ username: user.username, uniqueUrl });
  try {
    await mailSender({
      to: email,
      subject: Message.FORGET_PASSWORD_MAIL,
      message: html,
    });

    await session.commitTransaction();

    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.FORGET_PASSWORD_MAIL,
    });
  } catch (error) {
    logger(ErrorMessage.UNABLE_TO_SEND_MAIL, LogLevel.ERROR, error);
    clearTimeout(timeoutId);

    await session.abortTransaction();

    return res.json({
      status: ResponseStatus.ERROR,
      error:
        error.code === "EENVELOPE" ? ErrorMessage.INVALID_EMAIL : ErrorMessage.SERVER_ERROR,
    });
  } finally {
    if (session) session.endSession();
  }
});

/**
 * @api Forget password verification
 */
app.post("/forget-password-verify", async function (req, res) {
  const { email, verificationToken, password: plainPassword } = req.body;

  // Validation
  if (plainPassword.length < 8) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SHORT_PASSWORD,
    });
  }

  let user;
  try {
    user = await User.findOne({ email }).lean();
  } catch (error) {
    logger(ErrorMessage.UNABLE_TO_FIND_USER, LogLevel.ERROR, error);
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SERVER_ERROR,
    });
  }

  // Authorization
  if (!user) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.NOT_REGISTERED,
    });
  }
  if (!user.status) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.NOT_ALLOWED,
    });
  } else if (user.status == AccountStatus.UNVERIFIED) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.NOT_VERIFIED,
    });
  } else if (user.verificationToken !== verificationToken) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.INVALID_TOKEN,
    });
  }

  // Change password
  // Start a session
  const session = await mongoose.startSession();
  session.startTransaction();

  const password = await bcrypt.hash(plainPassword, 10);
  try {
    await User.updateMany(
      { email },
      { $unset: { status: "", verificationToken: "" } },
      { session }
    );
    await User.updateMany(
      { email },
      { $set: { password: password } },
      { session }
    ); // why not working in one query?
    const userData = await getUserData(email);

    await session.commitTransaction();

    logger(Message.VERIFY_SUCCESS.replace("#USEREMAIL#", user.email), LogLevel.INFO)
    return res.json({
      status: ResponseStatus.OK,
      username: user.username,
      userData,
    });
  } catch (error) {
    logger(ErrorMessage.UNABLE_TO_UPDATE_USER, LogLevel.ERROR, error);

    await session.abortTransaction();

    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SERVER_ERROR,
    });
  } finally {
    if (session) session.endSession();
  }
});

/**
 * @api Login user
 */
app.post("/login", async function (req, res) {
  const { email, password: plainPassword } = req.body;

  // Validation
  if (!plainPassword || !email) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.ALL_FIELDS_COMPULSORY,
    });
  }

  let user;
  try {
    user = await User.findOne({ email }).lean();
  } catch (error) {
    logger(ErrorMessage.UNABLE_TO_FIND_USER, LogLevel.ERROR, error);
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SERVER_ERROR,
    });
  }

  // Authorization
  if (!user) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.NOT_REGISTERED,
    });
  }
  if (user.status === AccountStatus.UNVERIFIED) {
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.NOT_VERIFIED,
    });
  }

  // Login the user
  if (await bcrypt.compare(plainPassword, user.password)) {
    const { username, email } = user;

    try {
      const userData = await getUserData(email);

      return res.json({
        status: ResponseStatus.OK,
        userCredentials: { username, email },
        userData,
      });
    } catch (error) {
      return res.json({
        status: ResponseStatus.ERROR,
        error: ErrorMessage.SERVER_ERROR,
      });
    }
  }
  return res.json({
    status: ResponseStatus.ERROR,
    error: ErrorMessage.INCORRECT_PASSWORD,
  });
});

/**
 * @api Modify user data
 */
app.post("/modify-data", async function (req, res) {
  //currently there is no immutable field in nodeData to find required nodeData. So need to send the two nodeData to distinguish between the oldNodeData to be deleted and newNodeData to be added
  const {
    email,
    toBeAdded: newNodeData,
    toBeDeleted: oldNodeData,
    operation,
  } = req.body;

  // Validation

  // Authorization

  // Add new node
  const addData = async (session) => {
    try {
      await UserData.updateOne(
        { email },
        { $addToSet: { data: newNodeData } },
        { session }
      );
    } catch (error) {
      throw error;
    }
  };

  // Delete a node
  const deleteData = async (session) => {
    try {
      await UserData.updateOne(
        { email },
        {
          $pull: {
            data: oldNodeData,
          },
        },
        { session }
      );
    } catch (error) {
      throw error;
    }
  };

  // Controller
  // Start a session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (operation === DataOperation.ADD) {
      addData(session);
    } else if (operation === DataOperation.DELETE) {
      deleteData(session);
    } else {
      // updating existing one
      deleteData(session);
      addData(session);
    }

    await session.commitTransaction();

    return res.json({ status: ResponseStatus.OK });
  } catch (error) {
    logger(ErrorMessage.UNABLE_TO_UPDATE_USERDATA, LogLevel.ERROR, error);

    await session.abortTransaction();

    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SERVER_ERROR,
    });
  } finally {
    if (session) session.endSession();
  }
});

app.listen(8000);
