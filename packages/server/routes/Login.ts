import {
  AccountStatus,
  ErrorMessage,
  LogLevel,
  Message,
  ResponseStatus,
} from "../constants";
import logger from "../logger";
import { UserType, getUserData } from "../server";
import User from "../model/user";
import bcrypt from "bcryptjs";

const Login = async (req, res) => {
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
};

export default Login;
