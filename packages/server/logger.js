const COLOR = {
  INFO: "\x1b[32m",
  ERROR: "\x1b[31m",
};

const logger = (message, level) => {
  const basicInfoString = `\x1b[1m${
    COLOR[level]
  }${new Date().toLocaleString()}] [${level}] |\x1b[22m${COLOR[level]}`;
  const formatResetString = "\x1b[0m";

  if (typeof message === "object") {
    if (level === "ERROR") {
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
