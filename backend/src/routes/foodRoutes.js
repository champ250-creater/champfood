import express from 'express';
import { 
  getAllFoods, 
  getFoodById, 
  getRestaurants, 
  getRestaurantById, 
  addFood, 
  updateFood, 
  deleteFood 
} from '../controllers/foodController.js';

// 🔥 IMPORT YOUR NEW CLOUDINARY UPLOAD TOOL
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Public Routes
router.get('/', getAllFoods);
router.get('/:id', getFoodById);
router.get('/restaurants/all', getRestaurants);
router.get('/restaurants/:id', getRestaurantById);

// Admin Routes (Notice we added upload.single('image') here!)
router.post('/add', upload.single('image'), addFood);
router.put('/:id', upload.single('image'), updateFood);
router.delete('/:id', deleteFood);

export default router;