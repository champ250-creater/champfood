import FoodService from '../services/foodService.js';
import pool from '../config/database.js';

class FoodController {
  
  // --- ADD FOOD ---
  static async addFood(req, res, next) {
    try {
      const { name, description, price, category, image_url } = req.body;

      const newFood = await pool.query(
        'INSERT INTO foods (name, description, price, category, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, description, price, category, image_url]
      );

      res.status(201).json({
        success: true,
        message: 'Ibiryo byongeweho neza! (Food added successfully)',
        data: newFood.rows[0]
      });
    } catch (error) {
      next(error);
    }
  }

  // --- UPDATE FOOD ---
  static async updateFood(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, price, image_url, category } = req.body;

      const result = await pool.query(
        'UPDATE foods SET name = $1, description = $2, price = $3, image_url = $4, category = $5 WHERE id = $6 RETURNING *',
        [name, description, price, image_url, category, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Food not found' });
      }

      res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
      next(error);
    }
  }

  // --- DELETE FOOD ---
  static async deleteFood(req, res, next) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM foods WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Food not found' });
      }

      res.status(200).json({ success: true, message: 'Food deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // --- GET ALL FOODS ---
  static async getAllFoods(req, res, next) {
    try {
      const foods = await FoodService.getAllFoods();
      res.status(200).json({
        success: true,
        message: 'Foods retrieved successfully',
        data: foods,
      });
    } catch (error) {
      next(error);
    }
  }

  // --- GET FOOD BY ID ---
  static async getFoodById(req, res, next) {
    try {
      const { id } = req.params;
      const food = await FoodService.getFoodById(id);
      res.status(200).json({
        success: true,
        message: 'Food retrieved successfully',
        data: food,
      });
    } catch (error) {
      next(error);
    }
  }

  // --- GET RESTAURANTS ---
  static async getRestaurants(req, res, next) {
    try {
      const restaurants = await FoodService.getRestaurants();
      res.status(200).json({
        success: true,
        message: 'Restaurants retrieved successfully',
        data: restaurants,
      });
    } catch (error) {
      next(error);
    }
  }

  // --- GET RESTAURANT BY ID ---
  static async getRestaurantById(req, res, next) {
    try {
      const { id } = req.params;
      const restaurant = await FoodService.getRestaurantById(id);
      res.status(200).json({
        success: true,
        message: 'Restaurant retrieved successfully',
        data: restaurant,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default FoodController;