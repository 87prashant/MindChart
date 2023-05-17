import {
  AuthProvider,
  ErrorMessage,
  LogLevel,
  Message,
  ResponseStatus,
} from "../constants";
import logger from "../logger";
import { UserType, createUserData, getUserData, session } from "../server";
import User from "../model/user";
import passwordGenerator from "password-generator";

const googleAuth = async (req, res) => {
  const { email, username, emailVerified, picture, uid } = req.body;
  logger(
    `Request received for google authentication, email: ${email}`,
    LogLevel.INFO
  );
  if (!emailVerified) {
    logger(`Email not verified, email: ${email}`, LogLevel.INFO);
    return res.json({
      status: ResponseStatus.ERROR,
      error: ErrorMessage.GOOGLE_AUTH_EMAIL_UNVERIFIED,
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
  if (user) {
    if (user.uid === uid && user.provider === AuthProvider.GOOGLE) {
      try {
        const userData = await getUserData(email);
        logger(
          `Google authentication successful, email: ${email}`,
          LogLevel.INFO
        );
        return res.json({
          status: ResponseStatus.OK,
          userCredentials: { username, email, imageUrl: picture },
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
    } else {
      try {
        session.startTransaction();
        await User.updateOne(
          { email },
          {
            $set: {
              username,
              provider: AuthProvider.GOOGLE,
              imageUrl: picture,
              uid,
            },
          },
          { session }
        );
        const userData = await getUserData(email);
        session.commitTransaction();
        logger(
          `Google authentication successful, email: ${email}`,
          LogLevel.INFO
        );
        return res.json({
          status: ResponseStatus.OK,
          userCredentials: { username, email, imageUrl: picture },
          userData,
        });
      } catch (error) {
        session.abortTransaction();
        logger(
          `${ErrorMessage.UNABLE_TO_UPDATE_USER} for google authentication, email: ${email}`,
          LogLevel.ERROR,
          error
        );
        return res.json({
          status: ResponseStatus.ERROR,
          error: ErrorMessage.SERVER_ERROR,
        });
      }
    }
  } else {
    session.startTransaction();
    try {
      await User.create(
        [
          {
            username,
            email,
            password: passwordGenerator(10),
            createdAt: new Date(),
            provider: AuthProvider.GOOGLE,
            uid,
            imageUrl: picture,
          },
        ],
        { session }
      );
      await createUserData(email, session);
      session.commitTransaction();
      logger(
        `${Message.NEW_USER_ADDED}, through ${AuthProvider.GOOGLE}`,
        LogLevel.INFO
      );
      logger(
        `Google authentication successful, email: ${email}`,
        LogLevel.INFO
      );
      return res.json({
        status: ResponseStatus.OK,
        userCredentials: { username, email },
        userData: null,
      });
    } catch (error) {
      session.abortTransaction();
      logger(
        `${ErrorMessage.UNABLE_TO_CREATE_USER} for google authentication, email: ${email}`,
        LogLevel.ERROR,
        error
      );
      return res.json({
        status: ResponseStatus.ERROR,
        error: ErrorMessage.SERVER_ERROR,
      });
    }
  }
};

export default googleAuth;
