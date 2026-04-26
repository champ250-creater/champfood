import pool from '../config/database.js';

class FoodService {
  // Get all foods
  static async getAllFoods() {
    try {
      const result = await pool.query(
        `SELECT f.id, f.name, f.description, f.price, f.image, f.rating, 
                r.name as "restaurantName" FROM foods f 
         LEFT JOIN restaurants r ON f.restaurant_id = r.id 
         ORDER BY f.created_at DESC`
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get food by ID
  static async getFoodById(foodId) {
    try {
      const result = await pool.query(
        `SELECT f.id, f.name, f.description, f.price, f.image, f.rating, 
                r.name as "restaurantName" FROM foods f 
         LEFT JOIN restaurants r ON f.restaurant_id = r.id 
         WHERE f.id = $1`,
        [foodId]
      );

      if (result.rows.length === 0) {
        const error = new Error('Food not found');
        error.status = 404;
        throw error;
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all restaurants
  static async getRestaurants() {
    try {
      const result = await pool.query(
        'SELECT * FROM restaurants ORDER BY name'
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get restaurant by ID
  static async getRestaurantById(restaurantId) {
    try {
      const result = await pool.query(
        'SELECT * FROM restaurants WHERE id = $1',
        [restaurantId]
      );

      if (result.rows.length === 0) {
        const error = new Error('Restaurant not found');
        error.status = 404;
        throw error;
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

export default FoodService;
