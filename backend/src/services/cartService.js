import pool from '../config/database.js';

class CartService {
  // Add to cart
  static async addToCart(userId, foodId, quantity) {
    try {
      // Check if item already in cart
      const cartItem = await pool.query(
        'SELECT * FROM cart_items WHERE user_id = $1 AND food_id = $2',
        [userId, foodId]
      );

      if (cartItem.rows.length > 0) {
        // Update quantity
        const newQuantity = cartItem.rows[0].quantity + quantity;
        const result = await pool.query(
          'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *',
          [newQuantity, cartItem.rows[0].id]
        );
        return result.rows[0];
      }

      // Create new cart item
      const result = await pool.query(
        'INSERT INTO cart_items (user_id, food_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [userId, foodId, quantity]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get cart
  static async getCart(userId) {
    try {
      const result = await pool.query(
        `SELECT ci.id, ci.quantity, f.id as "foodId", f.name, f.price, f.image, r.name as "restaurantName"
         FROM cart_items ci
         JOIN foods f ON ci.food_id = f.id
         LEFT JOIN restaurants r ON f.restaurant_id = r.id
         WHERE ci.user_id = $1`,
        [userId]
      );

      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Update cart item
  static async updateCartItem(cartItemId, quantity) {
    try {
      const result = await pool.query(
        'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *',
        [quantity, cartItemId]
      );

      if (result.rows.length === 0) {
        const error = new Error('Cart item not found');
        error.status = 404;
        throw error;
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Remove from cart
  static async removeFromCart(cartItemId) {
    try {
      await pool.query('DELETE FROM cart_items WHERE id = $1', [cartItemId]);
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Clear cart
  static async clearCart(userId) {
    try {
      await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

export default CartService;
