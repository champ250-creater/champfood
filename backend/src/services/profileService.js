import pool from '../config/database.js';

class ProfileService {
  // Get full user profile
  static async getProfile(userId) {
    try {
      const result = await pool.query(
        `SELECT id, name, email, phone, bio, avatar_url, city, address, created_at
         FROM users WHERE id = $1`,
        [userId]
      );
      if (result.rows.length === 0) {
        const error = new Error('User not found');
        error.status = 404;
        throw error;
      }
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update profile fields
  static async updateProfile(userId, { name, phone, bio, city, address }) {
    try {
      const result = await pool.query(
        `UPDATE users
         SET name = COALESCE($1, name),
             phone = COALESCE($2, phone),
             bio = COALESCE($3, bio),
             city = COALESCE($4, city),
             address = COALESCE($5, address),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING id, name, email, phone, bio, avatar_url, city, address`,
        [name, phone, bio, city, address, userId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update avatar URL (after Cloudinary upload)
  static async updateAvatar(userId, avatarUrl) {
    try {
      const result = await pool.query(
        `UPDATE users SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING id, name, email, phone, bio, avatar_url, city, address`,
        [avatarUrl, userId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Change password
  static async changePassword(userId, hashedPassword) {
    try {
      await pool.query(
        `UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        [hashedPassword, userId]
      );
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Get user order history (last 10)
  static async getOrderHistory(userId) {
    try {
      const result = await pool.query(
        `SELECT o.id, o.total_price, o.status, o.delivery_location, o.created_at,
                json_agg(json_build_object(
                  'name', f.name,
                  'quantity', oi.quantity,
                  'price', oi.price
                )) as items
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         LEFT JOIN foods f ON oi.food_id = f.id
         WHERE o.user_id = $1
         GROUP BY o.id
         ORDER BY o.created_at DESC
         LIMIT 10`,
        [userId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Delete account
  static async deleteAccount(userId) {
    try {
      await pool.query('DELETE FROM users WHERE id = $1', [userId]);
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

export default ProfileService;
