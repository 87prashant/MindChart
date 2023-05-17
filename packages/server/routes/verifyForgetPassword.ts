import {
  AccountStatus,
  ErrorMessage,
  LogLevel,
  Message,
  ResponseStatus,
} from "../constants";
import logger from "../logger";
import { UserType, getUserData, session } from "../server";
import User from "../model/user";
import bcrypt from "bcryptjs";

const verifyForgetPassword = async (req, res) => {
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
};

export default verifyForgetPassword;
