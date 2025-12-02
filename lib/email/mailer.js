const nodemailer = require('nodemailer');
require('dotenv').config();

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendEmail = async (options) => {
    const mailOptions = {
        from: process.env.SMTP_FROM || 'Secure Cloud <noreply@securecloud.com>',
        to: options.email,
        subject: options.subject,
        html: options.html,
        text: options.text
    };

    await transport.sendMail(mailOptions);
};

const sendVerificationEmail = async (email, token) => {
    const verifyUrl = `${process.env.APP_URL}/auth/verify.html?token=${token}`;

    const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Secure Cloud! 🔒</h2>
      <p>Please verify your email address to activate your account.</p>
      <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>Or copy this link: ${verifyUrl}</p>
    </div>
  `;

    await sendEmail({
        email,
        subject: 'Verify your Secure Cloud account',
        html: message,
        text: `Verify your account: ${verifyUrl}`
    });
};

const sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${process.env.APP_URL}/auth/reset-password.html?token=${token}`;

    const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset Password Request 🔑</h2>
      <p>You requested a password reset. Click the button below to set a new password.</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    </div>
  `;

    await sendEmail({
        email,
        subject: 'Reset your Secure Cloud password',
        html: message,
        text: `Reset password: ${resetUrl}`
    });
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
};
