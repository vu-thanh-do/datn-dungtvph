import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();
export const sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'quanlmph18475@fpt.edu.vn',
      pass: 'mjwe ndme lurl dzor',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const info = await transporter.sendMail({
    from: '"Hey 🙋🏻‍♂️" <milktea@gmail.com>',
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });
};
