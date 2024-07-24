import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv';
dotenv.config()
export const sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MP,
    },
  })
  const info = await transporter.sendMail({
    from: '"Hey 🙋🏻‍♂️" <milktea@gmail.com>',
    to: data.to, 
    subject: data.subject, 
    text: data.text, 
    html: data.html, 
  })
}
