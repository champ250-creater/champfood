import AuthService from '../services/authService.js';

class AuthController {
  // ─── SIGNUP ────────────────────────────────────────────────
  static async signup(req, res, next) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: 'Email, password, and name are required',
        });
      }

      const result = await AuthService.signup(email, password, name);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // ─── LOGIN ─────────────────────────────────────────────────
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      const result = await AuthService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // ─── FORGOT PASSWORD (Send OTP) ───────────────────────────
  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required',
        });
      }

      await AuthService.sendPasswordResetOTP(email);

      res.status(200).json({
        success: true,
        message: 'OTP yoherejwe kuri email yawe (OTP sent to your email)',
      });
    } catch (error) {
      // If user not found (404), still return success for security
      if (error.status === 404) {
        return res.status(200).json({
          success: true,
          message: 'Niba email ibaho, OTP yakoherejwe (If the email exists, an OTP was sent)',
        });
      }
      next(error);
    }
  }

  // ─── RESET PASSWORD (Verify OTP + Set New Password) ───────
  static async resetPassword(req, res, next) {
    try {
      const { email, otp, password } = req.body;

      if (!email || !otp || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email, OTP code, and new password are required',
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters',
        });
      }

      await AuthService.verifyOTPAndResetPassword(email, otp, password);

      res.status(200).json({
        success: true,
        message: 'Ijambo ryibanga ryahinduwe neza! (Password changed successfully!)',
      });
    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      next(error);
    }
  }
}

export default AuthController;