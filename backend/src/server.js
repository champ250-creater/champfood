import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import passport from 'passport'; // NEW: Import passport

import './config/passport.js'; // NEW: Import your Google strategy configuration

import authRoutes from './routes/authRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔥 AUTOMATIC MIGRATION: Ensure profile columns exist on startup (especially for Render)
import pool from './config/database.js';
pool.query(`
  ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
  ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
  ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
  ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
`).then(() => console.log('✅ Auto-migration: Profile columns verified'))
  .catch(err => console.error('❌ Auto-migration failed:', err.message));

// Middleware
app.use(helmet());

// 🔥 THE BUG FIX IS HERE: We are using an array to allow BOTH links!
app.use(cors({
  origin: ['http://localhost:5173', 'https://ntuma.vercel.app'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// NEW: Initialize Passport (Must be after express.json and cors, but before routes)
app.use(passport.initialize());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;