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

const mailSender = async (data) => {
  const { to, subject, message } = data;
  const email = {
    from: process.env.EMAIL_ADDRESS,
    to,
    subject,
    body: message,
  };
  try {
    const result = await transporter.sendMail(email);
    logger(`Mail Sent... \n${JSON.stringify(result.envelope)}`, "INFO");
  } catch (error) {
    logger(error, "ERROR");
  }
};

module.exports = mailSender;