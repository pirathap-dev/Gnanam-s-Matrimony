const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const isMock = process.env.EMAIL_USER === 'mock_email@gmail.com' || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'mock_pass';

let transporter;
if (!isMock) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

const sendNotificationEmail = async (submissionId, name) => {
  if (isMock) {
    console.log(`[MOCK EMAIL] Simulation: Notification email would be sent to Admin for submission from ${name} (ID: ${submissionId})`);
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Matrimony Submission: ${name}`,
    text: `You have received a new matrimony profile submission from ${name}. 
Please log in to the admin dashboard to review the details:
Submission ID: ${submissionId}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Notification email sent for', name);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendNotificationEmail };
