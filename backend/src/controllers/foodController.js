import FoodService from '../services/foodService.js';

class FoodController {
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
