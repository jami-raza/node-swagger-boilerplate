const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    pool: true,
    port: 465,
    secure: true,
    host: 'smtp.hostinger.com',
    auth: {
      user: 'support@my.wealthbudgetplanner.com',
      pass: 'iOn0m4CNuZ8#',
    },
});

module.exports = transporter;