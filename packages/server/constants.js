/**
 * 1. Error messages: {@link ErrorMessage}
 * 2. Non-Error messages {@link Message}
 * 3. Log Level: {@link LogLevel}
 * 4. Log color: {@link LogColor}
 * 5. User Account Status: {@link AccountStatus}
 * 6. Response Status: {@link ResponseStatus}
 * 7. Data operation: {@link DataOperation}
 */

const ErrorMessage = {
  EMPTY_MONGODB_URI: "MONGODB_URI is empty!!!",
  ALL_FIELDS_COMPULSORY: "All fields are compulsory",
  INCORRECT_PASSWORD: "Incorrect Password",
  ALREADY_REGISTERED: "Email is already registered",
  EMPTY_MAIL: "Email is empty",
  NOT_VERIFIED: "You are not verified",
  NOT_REGISTERED: "You are not found, Register first",
  NOT_ALLOWED: "You are not allowed",
  INVALID_TOKEN: "Invalid verification token",
  INVALID_EMAIL: "Invalid Email",
  SHORT_PASSWORD: "Password should be at least 8 symbol long",
  SHORT_USERNAME: "Username should be at least 5 symbol long",
  FORGET_PASSWORD_MAIL: "Forget Password mail sent",
  DATABASE_ERROR: "Database operation failed",
  VERIFICATION_MAIL: "Please verify through email",
  SERVER_ERROR: "Error on our end, try again",
  DATABASE_NOT_CONNECTED: "Unable to connect to database",
  UNABLE_TO_CREATE_USERDATA: "Unable to create user data",
  UNABLE_TO_FIND_USERDATA: "Unable to find userdata",
  UNABLE_TO_REMOVE_USER: "Unable to remove user",
  UNABLE_TO_REMOVE_TOKEN: "Unable to remove verification token",
  UNABLE_TO_FIND_USER: "Unable to find user",
  UNABLE_TO_UPDATE_USER: "Unable to update user",
  UNABLE_TO_CREATE_USER: "Unable to create new user",
  UNABLE_TO_SEND_MAIL: "Unable to send mail",
  UNABLE_TO_UPDATE_USERDATA: "Unable to update user data",
};

const Message = {
  NEW_USER_ADDED: "New user registered",
  FORGET_PASSWORD_MAIL: "Forget Password Mail",
  VERIFY_SUCCESS: "#USEREMAIL#, verified successfully!",
  VERIFICATION_MAIL: "Verification Mail",
  MAIL_SENT: "Mail Sent...",
  CONNECTED_DATABASE: "Connected to database successfully",
};

const LogLevel = {
  ERROR: "ERROR",
  INFO: "INFO",
};

const LogColor = {
  ERROR_COLOR: "\x1b[31m", //red
  INFO_COLOR: "\x1b[32m", //green
};

const AccountStatus = {
  UNVERIFIED: "Unverified",
  FORGET_PASSWORD: "Forget_Password",
};

const ResponseStatus = {
  ERROR: "error",
  OK: "ok",
};

const DataOperation = {
  ADD: "Add",
  DELETE: "Delete",
  UPDATE: "Update",
};

module.exports = {
  ErrorMessage,
  Message,
  LogLevel,
  LogColor,
  AccountStatus,
  ResponseStatus,
  DataOperation,
};
