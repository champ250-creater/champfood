import pool from '../config/database.js';
import FoodService from '../services/foodService.js';

// ==========================================
// PUBLIC FUNCTIONS
// ==========================================

export const getAllFoods = async (req, res, next) => {
  try {
    const foods = await FoodService.getAllFoods();
    res.status(200).json({ success: true, data: foods });
  } catch (error) {
    next(error);
  }
};

export const getFoodById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const food = await FoodService.getFoodById(id);
    res.status(200).json({ success: true, data: food });
  } catch (error) {
    next(error);
  }
};

export const getRestaurants = async (req, res, next) => {
  try {
    const restaurants = await FoodService.getRestaurants();
    res.status(200).json({ success: true, data: restaurants });
  } catch (error) {
    next(error);
  }
};

export const getRestaurantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const restaurant = await FoodService.getRestaurantById(id);
    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN FUNCTIONS
// ==========================================

export const addFood = async (req, res, next) => {
  try {
    const { name, description, price, category } = req.body;
    
    // Get the Cloudinary URL
    const uploadedImage = req.file ? req.file.path : req.body.image_url;

    // 🔥 FIX: We separate $5 and $6, passing 'uploadedImage' twice in the array so the DB doesn't get confused
    const newFood = await pool.query(
      'INSERT INTO foods (name, description, price, category, image, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, category, uploadedImage, uploadedImage]
    );

    res.status(201).json({
      success: true,
      message: 'Food added successfully',
      data: newFood.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

export const updateFood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;
    
    const uploadedImage = req.file ? req.file.path : req.body.image_url;

    // 🔥 FIX: We do the exact same thing here with $4 and $5!
    const result = await pool.query(
      'UPDATE foods SET name = $1, description = $2, price = $3, image = $4, image_url = $5, category = $6 WHERE id = $7 RETURNING *',
      [name, description, price, uploadedImage, uploadedImage, category, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteFood = async (req, res, next) => {
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
};