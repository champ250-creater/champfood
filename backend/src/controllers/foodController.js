import FoodService from '../services/foodService.js';
import pool from '../config/database.js'; // Make sure to add this import!

class FoodController {
  
  // 🚨 THE NEW ADMIN FUNCTION WE NEED 🚨
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

  // --- Your Existing Functions Below ---

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