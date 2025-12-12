import nodemailer from 'nodemailer';

// Create reusable transporter
export const mailer = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter configuration
mailer.verify((error, success) => {
  if (error) {
    console.error('❌ Email service error:', error);
  } else {
    console.log('✅ Email service ready');
  }
});

/**
 * Send OTP email to user
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP code
 * @param {string} name - User's name (optional)
 */
export const sendOTPEmail = async (email, otp, name = 'User') => {
  const mailOptions = {
    from: {
      name: 'SLAY Fashion',
      address: process.env.EMAIL_USER || 'saitejagovikar1@gmail.com'
    },
    to: email,
    subject: 'Password Reset OTP - SLAY',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header {
            background-color: #000000;
            color: #ffffff;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            letter-spacing: 2px;
          }
          .content {
            padding: 40px 30px;
          }
          .otp-box {
            background-color: #f8f8f8;
            border: 2px dashed #000000;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #000000;
            margin: 10px 0;
          }
          .message {
            color: #333333;
            line-height: 1.6;
            font-size: 16px;
          }
          .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
          }
          .footer {
            background-color: #f8f8f8;
            padding: 20px;
            text-align: center;
            color: #666666;
            font-size: 14px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #000000;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SLAY</h1>
          </div>
          <div class="content">
            <p class="message">Hello ${name},</p>
            <p class="message">
              We received a request to reset your password. Use the OTP code below to complete the password reset process.
            </p>
            
            <div class="otp-box">
              <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; color: #666; font-size: 12px;">Valid for 10 minutes</p>
            </div>
            
            <p class="message">
              Enter this code on the password reset page to continue.
            </p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong><br>
              • Do not share this OTP with anyone<br>
              • SLAY will never ask for your OTP via phone or email<br>
              • If you didn't request this, please ignore this email
            </div>
            
            <p class="message">
              This OTP will expire in <strong>10 minutes</strong>. If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>© 2025 SLAY Fashion. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hello ${name},
      
      Your OTP for password reset is: ${otp}
      
      This code will expire in 10 minutes.
      
      If you didn't request this, please ignore this email.
      
      - SLAY Fashion Team
    `
  };

  try {
    const info = await mailer.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send OTP email');
  }
};

/**
 * Send password reset confirmation email
 * @param {string} email - Recipient email
 * @param {string} name - User's name (optional)
 */
export const sendPasswordResetConfirmation = async (email, name = 'User') => {
  const mailOptions = {
    from: {
      name: 'SLAY Fashion',
      address: process.env.EMAIL_USER || 'saitejagovikar1@gmail.com'
    },
    to: email,
    subject: 'Password Reset Successful - SLAY',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header {
            background-color: #28a745;
            color: #ffffff;
            padding: 30px;
            text-align: center;
          }
          .content {
            padding: 40px 30px;
          }
          .message {
            color: #333333;
            line-height: 1.6;
            font-size: 16px;
          }
          .footer {
            background-color: #f8f8f8;
            padding: 20px;
            text-align: center;
            color: #666666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Password Reset Successful</h1>
          </div>
          <div class="content">
            <p class="message">Hello ${name},</p>
            <p class="message">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <p class="message">
              If you didn't make this change, please contact our support team immediately.
            </p>
          </div>
          <div class="footer">
            <p>© 2025 SLAY Fashion. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hello ${name},
      
      Your password has been successfully reset.
      
      If you didn't make this change, please contact support immediately.
      
      - SLAY Fashion Team
    `
  };

  try {
    await mailer.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    // Don't throw error for confirmation emails
    return { success: false };
  }
};

/**
 * Send welcome email for Google login
 * @param {string} email - Recipient email
 * @param {string} name - User's name
 */
export const sendWelcomeEmail = async (email, name = 'User') => {
  const mailOptions = {
    from: {
      name: 'SLAY Fashion',
      address: process.env.EMAIL_USER || 'saitejagovikar1@gmail.com'
    },
    to: email,
    subject: 'Welcome to SLAY! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #000000 0%, #333333 100%);
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 32px;
            letter-spacing: 3px;
          }
          .header p {
            margin: 0;
            font-size: 16px;
            opacity: 0.9;
          }
          .content {
            padding: 40px 30px;
          }
          .message {
            color: #333333;
            line-height: 1.8;
            font-size: 16px;
            margin-bottom: 20px;
          }
          .highlight-box {
            background-color: #f8f8f8;
            border-left: 4px solid #000000;
            padding: 20px;
            margin: 25px 0;
          }
          .button {
            display: inline-block;
            padding: 14px 35px;
            background-color: #000000;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            background-color: #f8f8f8;
            padding: 25px;
            text-align: center;
            color: #666666;
            font-size: 14px;
          }
          .social-links {
            margin: 15px 0;
          }
          .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #666666;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SLAY</h1>
            <p>Welcome to Premium Fashion</p>
          </div>
          <div class="content">
            <p class="message">Hello ${name},</p>
            <p class="message">
              🎉 <strong>Thank you for logging into SLAY!</strong> We're thrilled to have you back.
            </p>
            
            <div class="highlight-box">
              <p style="margin: 0; color: #333; font-size: 15px;">
                <strong>Your account is now active and ready!</strong><br>
                Explore our latest collections and enjoy a premium shopping experience.
              </p>
            </div>
            
            <p class="message">
              Here's what you can do:
            </p>
            <ul style="color: #333; line-height: 1.8;">
              <li>Browse our exclusive collections</li>
              <li>Save items to your wishlist</li>
              <li>Track your orders in real-time</li>
              <li>Enjoy personalized recommendations</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CORS_ORIGIN?.split(',')[0] || 'http://localhost:5173'}" class="button">
                Start Shopping
              </a>
            </div>
            
            <p class="message" style="font-size: 14px; color: #666;">
              If you have any questions or need assistance, our support team is always here to help.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 10px 0;"><strong>SLAY Fashion</strong></p>
            <p style="margin: 0 0 15px 0;">Premium Fashion, Delivered</p>
            <div class="social-links">
              <a href="#">Instagram</a> • 
              <a href="#">Facebook</a> • 
              <a href="#">Twitter</a>
            </div>
            <p style="margin: 15px 0 0 0; font-size: 12px;">
              © 2025 SLAY Fashion. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hello ${name},
      
      Thank you for logging into SLAY! We're thrilled to have you back.
      
      Your account is now active and ready. Explore our latest collections and enjoy a premium shopping experience.
      
      If you have any questions, our support team is here to help.
      
      - SLAY Fashion Team
    `
  };

  try {
    await mailer.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Welcome email send error:', error);
    // Don't throw error for welcome emails
    return { success: false };
  }
};

