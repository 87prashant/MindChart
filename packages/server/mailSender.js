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

const email = {
  from: "<From>",
  to: "<To>",
  subject: "Hello!",
  text: "Hello, this is a test email from SMTP.",
};

transporter.sendMail(email, (error, info) => {
  if (error) {
   console.log(error, "ERROR");
  } else {
    console.log(info, "INFO");
  }
});
