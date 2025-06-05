/* eslint-disable no-undef */
const nodemailer = require("nodemailer");
const { convert } = require("html-to-text");

module.exports = class Email {
  constructor(user, OTP) {
    this.to = user.email;
    this.firstName = user.name ? user.name.split(" ")[0] : "Admin";
    this.OTP = OTP;
    this.from = `${process.env.BRAND_NAME} <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(html, subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html), // Optionally convert HTML to plain text
    };

    // Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    const html = `
      <h1>Welcome to the ${process.env.BRAND_NAME}, ${this.firstName}!</h1>
      <p>We are excited to have you onboard.</p>
      <p>Click <a href="${this.OTP}">here</a> to get verified.</p>
    `;

    await this.send(html, `Welcome to the ${process.env.BRAND_NAME}!`);
  }

  async sendForgetPasswordOTP() {
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto;">
        <h1 style="color: #4CAF50;">Password Forget Request</h1>
        <p>Hi ${this.firstName},</p>
        <p>We received a request to forget your password. Please click the link below to forget your password:</p>
        <p>
          <a href="#" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          ${this.OTP}
          </a>
        </p>
        <p>If you did not request a password forget, please ignore this email.</p>
        <p>This link will expire in 5 minutes.</p>
        <p><strong>The ${process.env.BRAND_NAME}</strong></p>
      </div>  
    `;

    await this.send(
      html,
      "Your password forget token (valid only for 5 minutes)"
    );
  }
};
