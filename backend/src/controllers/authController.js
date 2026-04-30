import AuthService from '../services/authService.js';

class AuthController {
  // --- EXISTING SIGNUP ---
  static async signup(req, res, next) {
    try {
      const { email, password, name } = req.body;

      // Validate input
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

  // --- EXISTING LOGIN ---
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validate input
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

  // --- NEW: FORGOT PASSWORD ---
  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email irakenewe (Email is required)',
        });
      }

      // Call the service to generate the token and send the email
      await AuthService.generatePasswordReset(email);

      res.status(200).json({
        success: true,
        message: 'Link yoherejwe kuri email yawe (Reset link sent to your email)',
      });
    } catch (error) {
      // If the user isn't found (404), we still send a success message for security reasons
      // so hackers can't use this form to guess which emails are registered.
      if (error.status === 404) {
         return res.status(200).json({
          success: true,
          message: 'Niba email ibaho, twakohereje link (If the email exists, a link was sent)',
        });
      }
      next(error);
    }
  }

  // --- NEW: RESET PASSWORD ---
  static async resetPassword(req, res, next) {
    try {
      // The token comes from the URL parameters, the new password comes from the form body
      const { token } = req.params;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'Ijambo ryibanga rishya rirakenewe (New password is required)',
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Ijambo ryibanga rigomba kugira inyuguti byibura 6 (Password must be at least 6 characters)',
        });
      }

      // Call the service to verify the token and update the database
      await AuthService.resetPassword(token, password);

      res.status(200).json({
        success: true,
        message: 'Ijambo ryibanga ryahinduwe neza! (Password changed successfully!)',
      });
    } catch (error) {
      // Catch expired or invalid tokens
      if (error.status === 400) {
        return res.status(400).json({
          success: false,
          message: 'Link yakoreshejwe cyangwa yarengeje igihe (Link is invalid or has expired)',
        });
      }
      next(error);
    }
  }
}

export default AuthController;