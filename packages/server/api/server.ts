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
import User from "../model/user";
import UserData from "../model/userdata";
import logger from "../logger";
import { ErrorMessage, Message, LogLevel, AccountStatus } from "../constants";
import { ClientSession } from "mongodb";
import { Document } from "mongoose";
import googleAuth from "../routes/googleAuth";
import register from "../routes/register";
import verifyEmail from "../routes/verifyEmail";
import requestPasswordReset from "../routes/requestPasswordReset";
import verifyForgetPassword from "../routes/verifyForgetPassword";
import login from "../routes/login";
import modifyUserData from "../routes/modifyUserData";

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
app.post("/google-auth", googleAuth);

/**
 * @api Register user
 */
app.post("/register", register);

/**
 * @api Email verification
 */
app.post("/verify-email", verifyEmail);

/**
 * @api Forget password
 */
app.post("/forget-password", requestPasswordReset);

/**
 * @api Forget password verification
 */
app.post("/forget-password-verify", verifyForgetPassword);

/**
 * @api Login user
 */
app.post("/login", login);

/**
 * @api Modify user data
 */
app.post("/modify-data", modifyUserData);

app.listen(8000);
