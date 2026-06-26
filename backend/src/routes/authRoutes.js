import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import AuthController from '../controllers/authController.js';

const router = Router();

// ==========================================
// 1. STANDARD EMAIL/PASSWORD ROUTES
// ==========================================
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);

// ==========================================
// 2. PASSWORD RESET ROUTES
// ==========================================
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password/:token', AuthController.resetPassword);

// ==========================================
// 3. GOOGLE OAUTH ROUTES
// ==========================================

// Trigger Route: React sends the user here to log in
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Callback Route: Google sends the user back here after approving
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=true` }),
  (req, res) => {
    try {
      // Authentication succeeded!
      const user = req.user;
      
      // Generate the digital ID card (JWT)
      const token = jwt.sign(
        { id: user.id, email: user.email }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' } 
      );
      
      // Send the user back to the React frontend, carrying the token in the URL
      res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
      
    } catch (error) {
      console.error("Error generating token:", error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_failed`);
    }
  }
);

export default router;