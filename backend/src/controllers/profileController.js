import bcrypt from 'bcryptjs';
import ProfileService from '../services/profileService.js';

class ProfileController {
  // GET /api/profile
  static async getProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const profile = await ProfileService.getProfile(userId);
      res.status(200).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/profile
  static async updateProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const { name, phone, bio, city, address } = req.body;
      const updated = await ProfileService.updateProfile(userId, { name, phone, bio, city, address });
      res.status(200).json({ success: true, message: 'Profile updated successfully', data: updated });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/profile/avatar  (multipart/form-data with image field)
  static async updateAvatar(req, res, next) {
    try {
      const userId = req.user.userId;
      if (!req.file || !req.file.path) {
        return res.status(400).json({ success: false, message: 'No image uploaded' });
      }
      const avatarUrl = req.file.path; // Cloudinary URL set by multer-storage-cloudinary
      const updated = await ProfileService.updateAvatar(userId, avatarUrl);
      res.status(200).json({ success: true, message: 'Avatar updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/profile/password
  static async changePassword(req, res, next) {
    try {
      const userId = req.user.userId;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Both current and new passwords are required' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
      }

      // Verify current password
      const { rows } = await import('../config/database.js').then(m =>
        m.default.query('SELECT password FROM users WHERE id = $1', [userId])
      );
      const user = rows[0];
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      // OAuth users have no real password
      if (user.password === 'oauth-user-no-password') {
        return res.status(400).json({ success: false, message: 'OAuth users cannot set a password here. Use forgot password instead.' });
      }

      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);
      await ProfileService.changePassword(userId, hashed);

      res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/profile/orders
  static async getOrderHistory(req, res, next) {
    try {
      const userId = req.user.userId;
      const orders = await ProfileService.getOrderHistory(userId);
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/profile
  static async deleteAccount(req, res, next) {
    try {
      const userId = req.user.userId;
      await ProfileService.deleteAccount(userId);
      res.status(200).json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export default ProfileController;
