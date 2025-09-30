const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendMail = async (to, subject, html) => {
  return new Promise((resolve, reject) => {
    const mailConfigurations = {
      from: `Hariir <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    };
    transporter.sendMail(mailConfigurations, function (error, info) {
      if (error) return reject(error);
      return resolve(info);
    });
  });
};

module.exports = {
  VerifyEmail: async (email) => {
    try {
      console.log("Sending verification email to:", email.email);
      console.log("Sending verification token to:", email.token);
      const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${email.token}`;

      const html = `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
            
            <div style="background: #3B82F6; padding: 16px; text-align: center; color: white;">
              <h1 style="margin: 0;">Hariir.com</h1>
            </div>
            
            <div style="padding: 24px; color: #111827;">
              <h2 style="margin-top: 0; color: #1f2937;">Hello ,</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #374151;">
                Thank you for registering at <strong>Hariir.com</strong>.  
                Please verify your email address to complete your registration.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyUrl}" target="_blank" 
                   style="background: #3B82F6; color: #fff; padding: 12px 24px; 
                          border-radius: 6px; text-decoration: none; font-weight: bold; 
                          display: inline-block;">
                  Verify Email
                </a>
              </div>

              <p style="font-size: 14px; color: #6b7280;">
                If you didn’t create an account on <strong>Hariir.com</strong>, you can safely ignore this email.
              </p>
            </div>

            <div style="background: #f3f4f6; padding: 12px; text-align: center; font-size: 12px; color: #6b7280;">
              &copy; ${new Date().getFullYear()} Hariir.com. All rights reserved.
            </div>

          </div>
        </div>
      `;

      await sendMail(email.email, "Verify Your Email!", html);
    } catch (err) {
      console.error("Error sending verification email:", err);
      throw new Error("Failed to send verification email");
    }
  },
};
