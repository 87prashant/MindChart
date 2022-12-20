const nodemailer = require("nodemailer");
const logger = require("./logger");
require("dotenv").config({ path: "../../.env" });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailSender = (data) => {
  const { to, subject, body } = data;
  const email = {
    from: "87KumarPrashant@gmail.com ",
    to,
    subject,
    body,
  };
  transporter.sendMail(email, (error, info) => {
    if (error) {
      logger(error, "ERROR");
    } else {
      logger(info, "INFO");
    }
  });
};

module.exports = mailSender;
