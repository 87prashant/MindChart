import {
  AccountStatus,
  ErrorMessage,
  LogLevel,
  Message,
  ResponseStatus,
} from "../constants";
import logger from "../logger";
import { UserType, removeAccount, session } from "../server";
import User from "../model/user";
import bcrypt from "bcryptjs";
import getVerificationToken from "../getVerificationToken";
import registrationMailString from "../build/RegistrationMail";
import mailSender from "../mailSender";

const Register = async (req, res) => {
  const { username, email, password: plainPassword } = req.body;
  logger(
    `Request received for user registration, email: ${email}`,
    LogLevel.INFO
  );

  // Validation
  if (!plainPassword || !email || !username) {
    logger(
      `${ErrorMessage.ALL_FIELDS_COMPULSORY}, email: ${email}`,
      LogLevel.INFO
    );
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.ALL_FIELDS_COMPULSORY,
    });
  }
  if (username.length < 5) {
    logger(`${ErrorMessage.SHORT_USERNAME}, email: ${email}`, LogLevel.INFO);
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SHORT_USERNAME,
    });
  }
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

  const password = await bcrypt.hash(plainPassword, 10);
  const verificationToken = getVerificationToken();
  const createdAt = new Date();
  const uniqueUrl = `${process.env.ORIGIN}/verify-email/${email}/${verificationToken}`;
  const status = AccountStatus.UNVERIFIED;

  // Authorization and Registration
  // Start the transaction
  session.startTransaction();
  let timeoutId: NodeJS.Timeout | null = null;
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
        clearTimeout(timeoutId!);
        session.abortTransaction();
        logger(
          `${ErrorMessage.UNABLE_TO_UPDATE_USER}, email: ${email}`,
          LogLevel.ERROR,
          error
        );
        return res.json({
          status: ResponseStatus.ERROR,
          error: ErrorMessage.SERVER_ERROR,
        });
      }
    } else {
      session.abortTransaction();
      logger(
        `${ErrorMessage.ALREADY_REGISTERED}, email: ${email}`,
        LogLevel.INFO
      );
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
      clearTimeout(timeoutId!);
      session.abortTransaction();
      logger(
        `${ErrorMessage.UNABLE_TO_CREATE_USER}, email: ${email}`,
        LogLevel.ERROR,
        error
      );
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
    session.commitTransaction();
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.VERIFICATION_MAIL,
    });
  } catch (error) {
    clearTimeout(timeoutId);
    session.abortTransaction();
    logger(
      `${ErrorMessage.UNABLE_TO_REGISTER}, email: ${email}`,
      LogLevel.ERROR,
      error
    );
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SERVER_ERROR,
    });
  }
};

export default Register;
