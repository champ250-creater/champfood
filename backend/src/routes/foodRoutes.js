import { Router } from 'express';
import FoodController from '../controllers/foodController.js';

const router = Router();

// GET routes (Your existing ones for customers)
router.get('/', FoodController.getAllFoods);
router.get('/:id', FoodController.getFoodById);

// 🚨 POST route (The new one for the Admin Dashboard)
router.post('/add', FoodController.addFood);

export default router;