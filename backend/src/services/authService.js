import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { generateToken } from '../config/jwt.js';
import crypto from 'crypto'; 
import { Resend } from 'resend'; // 1. Import Resend

// 2. Initialize Resend with your API Key from Render Environment
const resend = new Resend(process.env.RESEND_API_KEY);

class AuthService {
  // --- SIGNUP (Remains the same) ---
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

  // --- LOGIN (Remains the same) ---
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

  // --- GENERATE PASSWORD RESET (AUTOMATED WITH RESEND) ---
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
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      // Save token to DB
      await pool.query(
        'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3',
        [hashedToken, expiresAt, email]
      );

      const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      // 3. SEND REAL EMAIL VIA API
      await resend.emails.send({
        from: 'onboarding@resend.dev', // Default sender for testing
        to: email, // This sends to the actual user's email
        subject: 'TechBite Kigali - Password Reset Request',
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h3>Hello ${user.name},</h3>
            <p>You requested a password reset for TechBite. Click the button below to continue.</p>
            <a href="${resetURL}" style="padding: 10px 20px; background-color: #20c269; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            <p style="margin-top: 20px;">This link is valid for 15 minutes.</p>
          </div>
        `
      });

      return { success: true, message: 'Email sent successfully!' };

    } catch (error) {
      throw error;
    }
  }

  // --- RESET PASSWORD (AUTOMATIC CLEANUP) ---
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

      // 4. RESET ITSELF: Token and Expires are set to NULL after use
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