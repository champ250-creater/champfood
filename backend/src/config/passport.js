import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

// IMPORTANT: Import your database connection pool here.
// You must adjust this path to point to the file where you configured 'pg'
import pool from '../config/database.js';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    proxy: true // <-- THIS IS THE CRUCIAL ADDITION FOR RENDER
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Get the email and name that Google sent us
      const email = profile.emails[0].value;
      const name = profile.displayName;
      
      // 1. Check PostgreSQL to see if a user with this email already exists
      const userResult = await pool.query(
        'SELECT * FROM users WHERE email = $1', 
        [email]
      );

      let user;

      if (userResult.rows.length > 0) {
        // 2a. The user exists in the database. Grab their data.
        user = userResult.rows[0];
      } else {
        // 2b. The user does NOT exist. Insert them into the 'users' table.
        // We use a dummy string for the password since they logged in via Google.
        const newUserResult = await pool.query(
          `INSERT INTO users (name, email, password) 
           VALUES ($1, $2, $3) 
           RETURNING *`,
          [name, email, 'oauth-user-no-password'] 
        );
        
        user = newUserResult.rows[0];
      }

      // 3. Let Passport know we successfully found or created the user
      return done(null, user); 

    } catch (err) {
      console.error("Database error during Google Authentication:", err);
      return done(err, null);
    }
  }
));

export default passport;