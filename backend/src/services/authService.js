import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { generateToken } from '../config/jwt.js';

class AuthService {
  // Signup
  static async signup(email, password, name) {
    try {
      // Check if user exists
      const userExists = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (userExists.rows.length > 0) {
        const error = new Error('Email already registered');
        error.status = 400;
        throw error;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
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

  // Login
  static async login(email, password) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

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
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;
