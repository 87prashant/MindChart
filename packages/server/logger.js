const COLOR = {
  INFO: "\x1b[32m",
  ERROR: "\x1b[31m",
};

const logger = (message, level) => {
  let indentedMessage = "";
  let firstLine = true;
  for (const line of message.split("\n")) {
    if (firstLine) {
      indentedMessage += `${line}\n`;
      firstLine = false;
    } else {
      indentedMessage += `\t\t\t\t ${line}\n`;
    }
  }
  console.log(
    `\x1b[1m${COLOR[level]}${new Date().toLocaleString()}] [${level}] |`,
    `\x1b[22m${COLOR[level]}${indentedMessage}`
  );
}

module.exports = logger;
