import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import pool from '../config/database.js';

dotenv.config();

// ─────────────────────────────────────────
// Shared helper: find or create user by email
// ─────────────────────────────────────────
async function findOrCreateUser(email, name) {
  const userResult = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (userResult.rows.length > 0) {
    return userResult.rows[0];
  }

  const newUserResult = await pool.query(
    `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
    [name, email, 'oauth-user-no-password']
  );
  return newUserResult.rows[0];
}

// ─────────────────────────────────────────
// GOOGLE OAUTH
// ─────────────────────────────────────────
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
    proxy: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const name = profile.displayName;
      const user = await findOrCreateUser(email, name);
      return done(null, user);
    } catch (err) {
      console.error('Google OAuth error:', err);
      return done(err, null);
    }
  }
));

export default passport;