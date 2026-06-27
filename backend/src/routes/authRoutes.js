import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import AuthController from '../controllers/authController.js';

const router = Router();

// ──────────────────────────────────────────────────────────────
// 1. STANDARD EMAIL/PASSWORD ROUTES
// ──────────────────────────────────────────────────────────────
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);

// ──────────────────────────────────────────────────────────────
// 2. PASSWORD RESET ROUTES
// ──────────────────────────────────────────────────────────────
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password/:token', AuthController.resetPassword);

// ──────────────────────────────────────────────────────────────
// 3. GOOGLE OAUTH
// ──────────────────────────────────────────────────────────────
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`,
  }),
  (req, res) => {
    try {
      const user = req.user;
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
    } catch (error) {
      console.error('Error generating OAuth token:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_failed`);
    }
  }
);

export default router;