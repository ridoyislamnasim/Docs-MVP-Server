import nodemailer from 'nodemailer';
import config from '../config/config.js';

export const transporter = nodemailer.createTransport({
  service: config.smtpService,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass
  }
});


export const sendMail = async (mailOptions) => {
  await transporter.sendMail(mailOptions);
};