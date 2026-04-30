import { Router } from 'express';
import AuthController from '../controllers/authController.js';

const router = Router();

// --- EXISTING ROUTES ---
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);

// --- NEW: PASSWORD RESET ROUTES ---
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password/:token', AuthController.resetPassword);

export default router;