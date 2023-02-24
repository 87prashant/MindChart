const nodemailer = require("nodemailer");
const logger = require("./logger");
require("dotenv").config({ path: "../../.env" });
const {LogLevel, Message} = require("./constants")

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailSender = async (data) => {
  const { to, subject, message } = data;
  
  const email = {
    from: process.env.EMAIL_ADDRESS,
    to,
    subject,
    html: message,
  };

  try {
    const result = await transporter.sendMail(email);
    logger(`${Message.MAIL_SENT} \n${JSON.stringify(result.envelope)}`, LogLevel.INFO);
  } catch (error) {
    throw error
  }
};

module.exports = mailSender;