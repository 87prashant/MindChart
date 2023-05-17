/**
 * Apis:
 * 1. Google Auth
 * 2. Register user
 * 3. Registered user verification
 * 4. Forget password
 * 5. Forget password verification
 * 6. Login
 * 7. Modify user data
 */

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import bcrypt from "bcryptjs";
import User from "./model/user";
import UserData from "./model/userdata";
import logger from "./logger";
import {
  ErrorMessage,
  Message,
  LogLevel,
  AccountStatus,
  ResponseStatus,
  DataOperation,
} from "./constants";
import { ClientSession } from "mongodb";
import { Document } from "mongoose";
import GoogleAuth from "./routes/GoogleAuth";
import Register from "./routes/Register";
import EmailVerification from "./routes/EmailVerification";
import ForgetPassword from "./routes/ForgetPassword";

const app = express();

require("dotenv").config({ path: "../../.env" });
app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());
app.use(cors());

const fiveMinutes = 1000 * 300;

app.get("/", (req, res) => res.send("The server is running"));

if (!process.env.MONGODB_URI)
  logger(ErrorMessage.EMPTY_MONGODB_URI, LogLevel.ERROR);

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI, (error) => {
  if (error) logger(ErrorMessage.DATABASE_NOT_CONNECTED, LogLevel.ERROR, error);
  else logger(Message.CONNECTED_DATABASE, LogLevel.INFO);
});

export let session: ClientSession;
async function getSession() {
  session = await mongoose.startSession();
}
getSession();

export interface UserType extends Document {
  username: string;
  email: string;
  password: string;
  provider?: string;
  imageUrl?: string;
  uid?: string;
  createdAt: string;
  status?: string;
  verificationToken?: string;
}

// Create new user empty data
export async function createUserData(email: string, session: ClientSession) {
  try {
    await UserData.create([{ email, data: [] }], { session });
    logger(`UserData created, email: ${email}`, LogLevel.INFO);
  } catch (error) {
    logger(
      `${ErrorMessage.UNABLE_TO_CREATE_USERDATA}, email: ${email}`,
      LogLevel.ERROR,
      error
    );
    throw error;
  }
}

// Fetch user data
export async function getUserData(email: string) {
  try {
    const userData = (await UserData.findOne({ email }).lean()).data;
    return userData;
  } catch (error) {
    logger(
      `${ErrorMessage.UNABLE_TO_FIND_USERDATA}, email: ${email}`,
      LogLevel.ERROR,
      error
    );
    throw error;
  }
}

// Remove unverified account after particular time
export function removeAccount(email: string) {
  const timeoutId = setTimeout(async () => {
    try {
      const deleteRes = await User.deleteOne({
        $and: [{ email }, { status: AccountStatus.UNVERIFIED }],
      });
      if (deleteRes.deletedCount > 0)
        logger(`Account removed, email: ${email}`, LogLevel.INFO);
    } catch (error) {
      logger(
        `${ErrorMessage.UNABLE_TO_REMOVE_USER}, email: ${email}`,
        LogLevel.ERROR,
        error
      );
    }
  }, fiveMinutes);
  return timeoutId;
}

// Remove token after five minutes (for password reset flow)
export function removeToken(email: string) {
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
      logger(`Token removed, email: ${email}`, LogLevel.INFO);
    } catch (error) {
      logger(
        `${ErrorMessage.UNABLE_TO_REMOVE_TOKEN}, email: ${email}`,
        LogLevel.ERROR,
        error
      );
    }
  }, fiveMinutes);
  return timeoutId;
}

/**
 * @api Google Auth
 */
app.post("/google-auth", GoogleAuth);

/**
 * @api Register user
 */
app.post("/register", Register);

/**
 * @api Email verification
 */
app.post("/verify-email", EmailVerification);

/**
 * @api Forget password
 */
app.post("/forget-password", ForgetPassword);

/**
 * @api Forget password verification
 */
app.post("/forget-password-verify", async function (req, res) {
  const { email, verificationToken, password: plainPassword } = req.body;
  logger(
    `Request received for password reset verification, email:  ${email}`,
    LogLevel.INFO
  );

  // Validation
  if (plainPassword.length < 8) {
    logger(`${ErrorMessage.SHORT_PASSWORD}, email: ${email}`, LogLevel.INFO);
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SHORT_PASSWORD,
    });
  }

  let user: UserType;
  try {
    user = await User.findOne({ email }).lean();
  } catch (error) {
    logger(
      `${ErrorMessage.UNABLE_TO_FIND_USER}, email: ${email}`,
      LogLevel.ERROR,
      error
    );
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SERVER_ERROR,
    });
  }

  // Authorization
  if (!user) {
    logger(`${ErrorMessage.NOT_REGISTERED}, email: ${email}`, LogLevel.INFO);
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.NOT_REGISTERED,
    });
  }
  if (!user.status) {
    logger(`${ErrorMessage.NOT_ALLOWED}, email: ${email}`, LogLevel.INFO);
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.NOT_ALLOWED,
    });
  } else if (user.status == AccountStatus.UNVERIFIED) {
    logger(`${ErrorMessage.NOT_VERIFIED}, email: ${email}`, LogLevel.INFO);
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.NOT_VERIFIED,
    });
  } else if (user.verificationToken !== verificationToken) {
    logger(`${ErrorMessage.INVALID_TOKEN}, email: ${email}`, LogLevel.INFO);
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.INVALID_TOKEN,
    });
  }

  // Change password
  // Start the transaction
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
    session.commitTransaction();
    logger(`${Message.VERIFY_SUCCESS}, email: ${email}`, LogLevel.INFO);
    return res.json({
      status: ResponseStatus.OK,
      username: user.username,
      imageUrl: user.imageUrl,
      userData,
    });
  } catch (error) {
    session.abortTransaction();
    logger(
      `${ErrorMessage.UNABLE_TO_UPDATE_USER} to reset password, email: ${email}`,
      LogLevel.ERROR,
      error
    );
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SERVER_ERROR,
    });
  }
});

/**
 * @api Login user
 */
app.post("/login", async function (req, res) {
  const { email, password: plainPassword } = req.body;
  logger(`Request received for login, email: ${email}`, LogLevel.INFO);

  // Validation
  if (!plainPassword || !email) {
    logger(
      `${ErrorMessage.ALL_FIELDS_COMPULSORY}, email: ${email}`,
      LogLevel.INFO
    );
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.ALL_FIELDS_COMPULSORY,
    });
  }

  let user: UserType;
  try {
    user = await User.findOne({ email }).lean();
  } catch (error) {
    logger(
      `${ErrorMessage.UNABLE_TO_FIND_USER}, email: ${email}`,
      LogLevel.ERROR,
      error
    );
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SERVER_ERROR,
    });
  }

  // Authorization
  if (!user) {
    logger(`${ErrorMessage.NOT_REGISTERED}, email: ${email}`, LogLevel.INFO);
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.NOT_REGISTERED,
    });
  }
  if (user.status === AccountStatus.UNVERIFIED) {
    logger(`${ErrorMessage.NOT_VERIFIED}, email: ${email}`, LogLevel.INFO);
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.NOT_VERIFIED,
    });
  }

  // Login the user
  if (await bcrypt.compare(plainPassword, user.password)) {
    const { username, email, imageUrl } = user;
    try {
      const userData = await getUserData(email);
      logger(`${Message.LOGIN_SUCCESS}, email: ${email}`, LogLevel.INFO);
      return res.json({
        status: ResponseStatus.OK,
        userCredentials: { username, email, imageUrl },
        userData,
      });
    } catch (error) {
      logger(
        `${ErrorMessage.UNABLE_TO_FIND_USERDATA}, email: ${email}`,
        LogLevel.ERROR,
        error
      );
      return res.json({
        status: ResponseStatus.ERROR,
        error: ErrorMessage.SERVER_ERROR,
      });
    }
  }
  logger(`${ErrorMessage.INCORRECT_PASSWORD}, email: ${email}`, LogLevel.INFO);
  return res.json({
    status: ResponseStatus.ERROR,
    error: ErrorMessage.INCORRECT_PASSWORD,
  });
});

/**
 * @api Modify user data
 */
app.post("/modify-data", async function (req, res) {
  const { email, data, operation } = req.body;
  logger(
    `Request received for user data modification, email: ${email}`,
    LogLevel.INFO
  );

  // check if user data present or not
  if (!(await UserData.findOne({ email }).lean())) {
    logger(
      `${ErrorMessage.UNABLE_TO_FIND_USERDATA}, email: ${email}`,
      LogLevel.INFO
    );
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SERVER_ERROR,
    });
  }

  // Validation

  // Authorization

  // Add new node
  const addData = async (session: ClientSession) => {
    try {
      await UserData.updateOne(
        { email },
        { $addToSet: { data: data } },
        { session }
      );
    } catch (error) {
      throw error;
    }
  };

  // Delete a node
  const deleteData = async (session: ClientSession) => {
    try {
      await UserData.updateOne(
        { email },
        { $pull: { data: data } },
        { session }
      );
    } catch (error) {
      throw error;
    }
  };

  // Update a node
  const updateData = async (session: ClientSession) => {
    try {
      await UserData.updateOne(
        { email, "data._id": data._id },
        { $set: { "data.$": data } },
        { session }
      );
    } catch (error) {
      throw error;
    }
  };

  // Controller
  // Start the transaction
  session.startTransaction();
  try {
    if (operation === DataOperation.ADD) {
      addData(session);
    } else if (operation === DataOperation.DELETE) {
      deleteData(session);
    } else if (operation === DataOperation.UPDATE) {
      updateData(session);
    }
    session.commitTransaction();
    logger(`${Message.USER_DATA_UPDATED}, email: ${email}`, LogLevel.INFO);
    return res.json({ status: ResponseStatus.OK });
  } catch (error) {
    session.abortTransaction();
    logger(
      `${ErrorMessage.UNABLE_TO_UPDATE_USERDATA}, email: ${email}`,
      LogLevel.ERROR,
      error
    );
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SERVER_ERROR,
    });
  }
});

app.listen(8000);
