import {
  AccountStatus,
  ErrorMessage,
  LogLevel,
  Message,
  ResponseStatus,
} from "../constants";
import logger from "../logger";
import { UserType, removeToken, session } from "../server";
import User from "../model/user";
import getVerificationToken from "../getVerificationToken";
import mailSender from "../mailSender";
import forgetPasswordMailString from "../build/ForgetPasswordMail";

const ForgetPassword = async (req, res) => {
  const { email } = req.body;
  logger(`Request received for password reset, email: ${email}`, LogLevel.INFO);

  // Validation
  if (!email.trim()) {
    logger(`${ErrorMessage.EMPTY_MAIL}`, LogLevel.INFO);
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.EMPTY_MAIL,
    });
  }

  let user: UserType;
  try {
    user = await User.findOne({ email }).lean();
  } catch (error) {
    logger(
      `${ErrorMessage.UNABLE_TO_FIND_USER}, email: ${email}`,
      LogLevel.INFO,
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

  const verificationToken = getVerificationToken();
  const uniqueUrl = `${process.env.ORIGIN}/forget-password-verify/${email}/${verificationToken}`;

  // Mark status as forget password
  // Start the transaction
  session.startTransaction();
  let timeoutId: NodeJS.Timeout | null = null;
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

  // Send mail
  const html = forgetPasswordMailString({ username: user.username, uniqueUrl });
  try {
    await mailSender({
      to: email,
      subject: Message.FORGET_PASSWORD_MAIL,
      message: html,
    });
    session.commitTransaction();
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.FORGET_PASSWORD_MAIL,
    });
  } catch (error) {
    clearTimeout(timeoutId);
    session.abortTransaction();
    logger(
      `${ErrorMessage.UNABLE_TO_FORGET_PASSWORD}, email: ${email}`,
      LogLevel.ERROR,
      error
    );
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.SERVER_ERROR,
    });
  }
};

export default ForgetPassword;
