import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { generateToken } from '../config/jwt.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// ─────────────────────────────────────────────────────────────
// Email transporter (Gmail + forced IPv4 to avoid Render IPv6 issues)
// ─────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME || 'byishimovedaste19@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'fhstinrwexhedajl',
  },
  // CRITICAL: Force IPv4 — Render cannot reach Google SMTP over IPv6
  tls: { rejectUnauthorized: false },
  dnsOptions: { family: 4 },
});

// Verify connection on startup
transporter.verify()
  .then(() => console.log('✅ Email transporter is ready (Gmail / IPv4)'))
  .catch((err) => console.error('❌ Email transporter error:', err.message));

// ─────────────────────────────────────────────────────────────
// Generate a 6-digit OTP
// ─────────────────────────────────────────────────────────────
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

class AuthService {
  // ─── SIGNUP ────────────────────────────────────────────────
  static async signup(email, password, name) {
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      const error = new Error('Email already registered');
      error.status = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    );

    const user = result.rows[0];
    const token = generateToken(user.id, user.email);
    return { token, user };
  }

  // ─── LOGIN ─────────────────────────────────────────────────
  static async login(email, password) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }

    const user = result.rows[0];

    // Google-only accounts have no real password
    if (!user.password || user.password === 'oauth-user-no-password') {
      const error = new Error('This account uses Google login. Please sign in with Google.');
      error.status = 401;
      throw error;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const error = new Error('Invalid email or password');
      error.status = 401;
      throw error;
    }

    const token = generateToken(user.id, user.email);
    return {
      token,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  // ─── SEND OTP FOR PASSWORD RESET ──────────────────────────
  static async sendPasswordResetOTP(email) {
    // 1. Find the user
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      // Security: don't reveal whether the email exists
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    const user = userResult.rows[0];

    // 2. Generate 6-digit OTP
    const otp = generateOTP();
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 3. Save hashed OTP to DB (reusing reset_password_token / reset_password_expires columns)
    await pool.query(
      'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3',
      [hashedOTP, expiresAt, email]
    );

    // 4. Send OTP email via Gmail
    const mailOptions = {
      from: `"NTUMA" <${process.env.EMAIL_USERNAME || 'byishimovedaste19@gmail.com'}>`,
      to: email,
      subject: 'NTUMA - Your Password Reset Code',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #10b981, #14b8a6); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 1px;">NTUMA</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Food Ordering Platform</p>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #1e293b; margin: 0 0 8px;">Hello ${user.name || 'there'} 👋</h2>
            <p style="color: #64748b; line-height: 1.6; margin: 0 0 24px;">You requested a password reset. Use this code to verify your identity:</p>
            <div style="background: #1e293b; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #10b981; font-family: 'Courier New', monospace;">${otp}</span>
            </div>
            <p style="color: #94a3b8; font-size: 13px; margin: 0 0 8px;">⏱ This code expires in <strong>10 minutes</strong>.</p>
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">If you didn't request this, please ignore this email.</p>
          </div>
          <div style="border-top: 1px solid #e2e8f0; padding: 16px 32px; text-align: center;">
            <p style="color: #cbd5e1; font-size: 11px; margin: 0;">NTUMA &mdash; Kigali, Rwanda</p>
          </div>
        </div>
      `,
    };

    try {
      console.log(`📧 Sending OTP to ${email}...`);
      await transporter.sendMail(mailOptions);
      console.log(`✅ OTP sent successfully to ${email}`);
    } catch (emailError) {
      console.error('❌ Email send failed:', emailError.message);
      console.error('   Code:', emailError.code || 'unknown');
      // Don't crash — let the controller handle it
      const error = new Error('Failed to send OTP email. Please try again.');
      error.status = 500;
      throw error;
    }

    return { success: true, message: 'OTP sent to your email.' };
  }

  // ─── VERIFY OTP & RESET PASSWORD ──────────────────────────
  static async verifyOTPAndResetPassword(email, otp, newPassword) {
    // 1. Hash the OTP the user entered
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
    const currentTime = new Date();

    // 2. Find user with matching OTP that hasn't expired
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND reset_password_token = $2 AND reset_password_expires > $3',
      [email, hashedOTP, currentTime]
    );

    if (userResult.rows.length === 0) {
      const error = new Error('Invalid or expired OTP code');
      error.status = 400;
      throw error;
    }

    // 3. Update the password
    const user = userResult.rows[0];
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await pool.query(
      'UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2',
      [hashedPassword, user.id]
    );

    return { success: true, message: 'Password updated successfully!' };
  }
}

export default AuthService;