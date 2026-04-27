import pool from '../config/database.js';

class OrderService {
  // Create order
  // NEW: Added deliveryLocation to the parameters
  static async createOrder(userId, items, totalPrice, deliveryLocation) {
    try {
      // Start transaction
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');

        // Create order
        // NEW: Added delivery_location to the INSERT statement and $4 to the values
        const orderResult = await client.query(
          'INSERT INTO orders (user_id, total_price, status, delivery_location) VALUES ($1, $2, $3, $4) RETURNING *',
          [userId, totalPrice, 'pending', deliveryLocation]
        );

        const order = orderResult.rows[0];

        // Add order items
        for (const item of items) {
          await client.query(
            'INSERT INTO order_items (order_id, food_id, quantity, price) VALUES ($1, $2, $3, $4)',
            [order.id, item.foodId || item.id, item.quantity, item.price]
          );
        }

        // Clear user cart
        await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

        await client.query('COMMIT');
        
        return order;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      throw error;
    }
  }

  // Get user orders
  static async getUserOrders(userId) {
    try {
      const result = await pool.query(
        `SELECT o.*, 
                json_agg(json_build_object(
                  'id', oi.id,
                  'name', f.name,
                  'quantity', oi.quantity,
                  'price', oi.price
                )) as items
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         LEFT JOIN foods f ON oi.food_id = f.id
         WHERE o.user_id = $1
         GROUP BY o.id
         ORDER BY o.created_at DESC`,
        [userId]
      );

      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get order by ID
  static async getOrderById(orderId) {
    try {
      const result = await pool.query(
        `SELECT o.*, 
                json_agg(json_build_object(
                  'id', oi.id,
                  'name', f.name,
                  'quantity', oi.quantity,
                  'price', oi.price
                )) as items
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         LEFT JOIN foods f ON oi.food_id = f.id
         WHERE o.id = $1
         GROUP BY o.id`,
        [orderId]
      );

      if (result.rows.length === 0) {
        const error = new Error('Order not found');
        error.status = 404;
        throw error;
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update order status
  static async updateOrderStatus(orderId, status) {
    try {
      const result = await pool.query(
        'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
        [status, orderId]
      );

      if (result.rows.length === 0) {
        const error = new Error('Order not found');
        error.status = 404;
        throw error;
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

export default OrderService;