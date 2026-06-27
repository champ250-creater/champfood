import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { generateToken } from '../config/jwt.js';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with the provided key (or env variable as fallback)
sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'OCXCS3IMQLfCYMRzQSHw723M9gufOJWk');

class AuthService {
  // --- SIGNUP ---
  static async signup(email, password, name) {
    try {
      const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
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
    } catch (error) { throw error; }
  }

  // --- LOGIN ---
  static async login(email, password) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        const error = new Error('Invalid email or password');
        error.status = 401;
        throw error;
      }
      const user = result.rows[0];
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
    } catch (error) { throw error; }
  }

  // --- GENERATE PASSWORD RESET ---
  static async generatePasswordReset(email) {
    try {
      const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userResult.rows.length === 0) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
      }

      const user = userResult.rows[0];
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Save token to DB
      await pool.query(
        'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3',
        [hashedToken, expiresAt, email]
      );

      const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      // Send the password reset email using SendGrid API
      // Note: The 'from' email MUST exactly match the Single Sender email you verified in SendGrid.
      const msg = {
        to: email,
        from: process.env.EMAIL_USERNAME || 'byishimovedaste19@gmail.com', // Fallback to your email if env is missing
        subject: 'TechBite Kigali - Password Reset Request',
        html: `
          <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #20c269;">TechBite Kigali</h2>
            <h3>Hello ${user.name},</h3>
            <p>You requested a password reset for your TechBite account. Click the button below to set a new password.</p>
            <a href="${resetURL}" style="display: inline-block; padding: 12px 24px; background-color: #20c269; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">
              Reset My Password
            </a>
            <p style="color: #666; margin-top: 20px;">This link is valid for <strong>15 minutes</strong>. If you did not request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
            <p style="color: #999; font-size: 12px;">TechBite Kigali &mdash; Food Ordering Platform</p>
          </div>
        `,
      };

      await sgMail.send(msg);

      return { success: true, message: 'Email sent successfully!' };

    } catch (error) {
      console.error('Password reset email error:', error);
      throw error;
    }
  }

  // --- RESET PASSWORD ---
  static async resetPassword(token, newPassword) {
    try {
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      const currentTime = new Date();

      const userResult = await pool.query(
        'SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > $2',
        [hashedToken, currentTime]
      );

      if (userResult.rows.length === 0) {
        const error = new Error('Token is invalid or has expired');
        error.status = 400;
        throw error;
      }

      const user = userResult.rows[0];
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await pool.query(
        'UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2',
        [hashedPassword, user.id]
      );

      return { success: true, message: 'Password updated successfully!' };
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;