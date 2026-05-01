import express from 'express';
// Import all the functions from your controller
import { 
  getAllFoods, 
  getFoodById, 
  getRestaurants, 
  getRestaurantById, 
  addFood, 
  updateFood, 
  deleteFood 
} from '../controllers/foodController.js';

const router = express.Router();

// ==========================================
// PUBLIC ROUTES (Anyone can see these)
// ==========================================
router.get('/', getAllFoods);
router.get('/:id', getFoodById);
router.get('/restaurants/all', getRestaurants);
router.get('/restaurants/:id', getRestaurantById);

// ==========================================
// ADMIN ROUTES (Adding, Editing, Deleting)
// ==========================================
router.post('/add', addFood);
router.put('/:id', updateFood);
router.delete('/:id', deleteFood);

export default router;