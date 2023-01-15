const { LogLevel, LogColor } = require("./constants");

const giveColor = {
  [LogLevel.INFO]: LogColor.INFO_COLOR,
  [LogLevel.ERROR]: LogColor.ERROR_COLOR,
};

const logger = (message, level) => {
  const basicInfoString = `\x1b[1m${
    giveColor[level]
  }[${new Date().toLocaleString()}] [${level}] |\x1b[22m${giveColor[level]}`;
  const formatResetString = "\x1b[0m";

  if (typeof message === "object") {
    if (level === Error.ERROR) {
      console.log(basicInfoString, message.stack, formatResetString);
      return;
    }
    console.log(basicInfoString, formatResetString);
    console.dir(message);
  } else {
    console.log(basicInfoString, message, formatResetString);
  }
};

module.exports = logger;
