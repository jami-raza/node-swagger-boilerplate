const nodemailer = require("nodemailer");
require('dotenv').config();
const transporter = nodemailer.createTransport({
    pool: true,
    port: 465,
    secure: true,
    host: process.env.SMTP_SERVER,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
});

module.exports = transporter;