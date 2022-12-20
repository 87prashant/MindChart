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

const mailSender = () => {
  const email = {
    from: "<From>",
    to: "teotiaprashant87@gmail.com",
    subject: "Hello!",
    text: "Hello, this is a test email from SMTP.",
  };
  transporter.sendMail(email, (error, info) => {
    if (error) {
      logger(error, "ERROR");
    } else {
      logger(info, "INFO");
    }
  });
}

mailSender();
