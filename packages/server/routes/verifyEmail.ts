import {
  AccountStatus,
  ErrorMessage,
  LogLevel,
  Message,
  ResponseStatus,
} from "../constants";
import logger from "../logger";
import { UserType, createUserData, session } from "../server";
import User from "../model/user";

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.body;
  logger(
    `Request received for email verification, email: ${email}`,
    LogLevel.INFO
  );
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
  if (user.status !== AccountStatus.UNVERIFIED) {
    logger(`${ErrorMessage.NOT_ALLOWED}, email: ${email}`, LogLevel.INFO);
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.NOT_ALLOWED,
    });
  }
  if (user.verificationToken !== verificationToken) {
    logger(`${ErrorMessage.INVALID_TOKEN}, email: ${email}`, LogLevel.INFO);
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.INVALID_TOKEN,
    });
  }

  // Update user as verified
  // Start the transaction
  session.startTransaction();
  try {
    await User.updateMany(
      { email },
      { $unset: { verificationToken: "", status: "" } }, // no status means verified
      { session }
    );
    await createUserData(email, session);
    session.commitTransaction();
    logger(`${Message.VERIFY_SUCCESS}, email: ${email}`, LogLevel.INFO);
    return res.json({
      status: ResponseStatus.OK,
      username: user.username,
      imageUrl: user.imageUrl,
    });
  } catch (error) {
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
};

export default verifyEmail;
