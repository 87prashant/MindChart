import nodemailer from "nodemailer";
import logger from "./logger";
require("dotenv").config({ path: "../../.env" });
import { ErrorMessage, LogLevel, Message } from "./constants";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailSender = async (data: {
  to: string;
  subject: string;
  message: string;
}) => {
  const { to, subject, message } = data;

  const email = {
    from: process.env.EMAIL_ADDRESS,
    to,
    subject,
    html: message,
  };

  try {
    const result = await transporter.sendMail(email);
    logger(
      `${Message.MAIL_SENT} \n${JSON.stringify(result.envelope)}`,
      LogLevel.INFO
    );
  } catch (error) {
    logger(
      `${ErrorMessage.UNABLE_TO_SEND_MAIL}, email: ${email}`,
      LogLevel.ERROR,
      error
    );
    throw error;
  }
};

export default mailSender;
