const { Resend } = require('resend');

const sendEmail = async ({ to, subject, html }) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Simulator bypass if user hasn't configured API key yet
  if (!process.env.RESEND_API_KEY) {
      console.warn("⚠️ RESEND_API_KEY missing inside .env!");
      console.warn("⚠️ Sending email SIMULATED. Real email was NOT sent.");
      console.warn(`--------------------------------------------------`);
      console.warn(`TO: ${to}`);
      console.warn(`SUBJECT: ${subject}`);
      console.warn(`--------------------------------------------------`);
      return true;
  }

  console.log(`Attempting to send email via Resend (Key starts with: ${process.env.RESEND_API_KEY.substring(0, 5)}...)`);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Seyal Imperial <orders@seyalimperial.com>',
      reply_to: 'seyalimperial@gmail.com',
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Resend Error Detail:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Resend Exception:", error);
    return null;
  }
};

module.exports = sendEmail;
