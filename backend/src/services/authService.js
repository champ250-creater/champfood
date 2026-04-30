import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { generateToken } from '../config/jwt.js';
import crypto from 'crypto'; // Built into Node.js for generating tokens
import nodemailer from 'nodemailer'; // Remember to run: npm install nodemailer

class AuthService {
  // --- EXISTING SIGNUP ---
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
    } catch (error) {
      throw error;
    }
  }

  // --- EXISTING LOGIN ---
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
    } catch (error) {
      throw error;
    }
  }

  // --- NEW: GENERATE PASSWORD RESET ---
  static async generatePasswordReset(email) {
    try {
      // 1. Check if user exists
      const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userResult.rows.length === 0) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
      }
      
      const user = userResult.rows[0];

      // 2. Generate a random reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      // 3. Hash the token for database security
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      
      // 4. Set expiration to 15 minutes from now
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      // 5. Save the hashed token and expiration time in NeonDB
      await pool.query(
        'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3',
        [hashedToken, expiresAt, email]
      );

      // 6. Setup Email Transporter (You will need an App Password from Gmail)
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USERNAME, 
          pass: process.env.EMAIL_PASSWORD  
        }
      });

      // 7. Send the email with the un-hashed token in the URL
      const resetURL = `http://localhost:5173/reset-password/${resetToken}`;
      
      const mailOptions = {
        from: 'NZANIRA Support <support@nzanira.com>',
        to: email,
        subject: 'Nzanira - Password Reset Request',
        html: `
          <h3>Hello ${user.name},</h3>
          <p>You requested a password reset. Click the button below to set a new password. This link is valid for 15 minutes.</p>
          <a href="${resetURL}" style="padding: 10px 20px; background-color: #20c269; color: white; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Reset Password</a>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `
      };

      await transporter.sendMail(mailOptions);
      return { message: 'Reset email sent successfully' };

    } catch (error) {
      throw error;
    }
  }

  // --- NEW: VERIFY AND RESET PASSWORD ---
  static async resetPassword(token, newPassword) {
    try {
      // 1. Hash the incoming token so it matches what is in the database
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      const currentTime = new Date();

      // 2. Find the user with this token, ensuring it hasn't expired
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

      // 3. Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // 4. Update the password and clear out the temporary tokens
      await pool.query(
        'UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2',
        [hashedPassword, user.id]
      );

      return { message: 'Password updated successfully' };
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;