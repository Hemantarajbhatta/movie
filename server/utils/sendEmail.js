import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendEmail = async ({ to, subject, html, attachmentPath }) => {
  // Only send if email is configured
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
    console.log('📧 Email not configured - skipping email send');
    return;
  }

  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Cinematix" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  if (attachmentPath) {
    mailOptions.attachments = [{
      filename: path.basename(attachmentPath),
      path: path.join(__dirname, '..', attachmentPath),
    }];
  }

  await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent to ${to}`);
};

export default sendEmail;
