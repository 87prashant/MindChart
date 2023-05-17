import {
  DataOperation,
  ErrorMessage,
  LogLevel,
  Message,
  ResponseStatus,
} from "../constants";
import logger from "../logger";
import { session } from "../server";
import UserData from "../model/userdata";
import { ClientSession } from "mongoose";

const modifyUserData = async (req, res) => {
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
};

export default modifyUserData;
