import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { generateToken } from '../config/jwt.js';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';

// ─────────────────────────────────────────────────────────────
// Initialize SendGrid
// ─────────────────────────────────────────────────────────────
const SENDGRID_KEY = process.env.SENDGRID_API_KEY || 'wH8Q4t910iIrghATn8u0eNyQe8t5Jamo';
sgMail.setApiKey(SENDGRID_KEY);

// Log whether the key looks valid (SendGrid keys always start with "SG.")
if (!SENDGRID_KEY.startsWith('SG.')) {
  console.warn('⚠️  WARNING: Your SENDGRID_API_KEY does not start with "SG." — emails will likely fail.');
  console.warn('   Go to https://app.sendgrid.com/settings/api_keys to create a valid key.');
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

  // ─── GENERATE PASSWORD RESET ───────────────────────────────
  static async generatePasswordReset(email) {
    // 1. Find the user
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      // For security, we DON'T tell the client the email doesn't exist.
      // The controller handles this by returning a fake success.
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    const user = userResult.rows[0];

    // 2. Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // 3. Save token to database
    await pool.query(
      'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3',
      [hashedToken, expiresAt, email]
    );

    // 4. Build the reset URL
    const frontendUrl = process.env.FRONTEND_URL || 'https://ntuma.vercel.app';
    const resetURL = `${frontendUrl}/reset-password/${resetToken}`;

    // 5. Build the email
    const fromEmail = process.env.EMAIL_USERNAME || 'byishimovedaste19@gmail.com';
    const msg = {
      to: email,
      from: fromEmail,
      subject: 'NTUMA - Password Reset Request',
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f8fafc; border-radius: 12px;">
          <div style="text-align: center; padding: 20px 0;">
            <h2 style="color: #10b981; margin: 0;">NTUMA</h2>
            <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Food Ordering Platform</p>
          </div>
          <div style="background: white; border-radius: 8px; padding: 24px; border: 1px solid #e2e8f0;">
            <h3 style="color: #1e293b; margin-top: 0;">Hello ${user.name || 'there'},</h3>
            <p style="color: #475569; line-height: 1.6;">You requested a password reset. Click the button below to set a new password:</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="${resetURL}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #10b981, #14b8a6); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Reset My Password
              </a>
            </div>
            <p style="color: #94a3b8; font-size: 13px;">This link expires in <strong>15 minutes</strong>. If you didn't request this, ignore this email.</p>
            <p style="color: #94a3b8; font-size: 13px;">Or copy this link: <br/><a href="${resetURL}" style="color: #10b981; word-break: break-all;">${resetURL}</a></p>
          </div>
          <p style="color: #cbd5e1; font-size: 11px; text-align: center; margin-top: 16px;">NTUMA &mdash; Food Ordering Platform</p>
        </div>
      `,
    };

    // 6. Try to send the email — NEVER crash the endpoint even if SendGrid fails
    try {
      console.log(`📧 Sending password reset email to ${email} from ${fromEmail}...`);
      await sgMail.send(msg);
      console.log(`✅ Password reset email sent successfully to ${email}`);
    } catch (emailError) {
      // Log the FULL error so you can see it in Render logs
      console.error('❌ SendGrid email failed:');
      console.error('   Status:', emailError?.code || emailError?.response?.statusCode || 'unknown');
      console.error('   Message:', emailError?.message || 'unknown');
      if (emailError?.response?.body) {
        console.error('   Body:', JSON.stringify(emailError.response.body, null, 2));
      }
      // DO NOT re-throw — we still return success so the UI works
    }

    return { success: true, message: 'If the email exists, a reset link was sent.' };
  }

  // ─── RESET PASSWORD ────────────────────────────────────────
  static async resetPassword(token, newPassword) {
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
  }
}

export default AuthService;