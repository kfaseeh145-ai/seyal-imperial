const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
  // Simulator bypass if user hasn't configured SMTP credentials yet
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("⚠️ SMTP credentials missing inside .env!");
      console.warn("⚠️ Sending email SIMULATED. Real email was NOT sent.");
      console.warn(`--------------------------------------------------`);
      console.warn(`TO: ${to}`);
      console.warn(`SUBJECT: ${subject}`);
      console.warn(`TEXT: ${text}`);
      console.warn(`--------------------------------------------------`);
      return true;
  }

  // Real Email Transporter (using industry standard Gmail for now)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Seyal Imperial" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = sendEmail;
