import apiClient from './api';

export { default as apiClient } from './api';

// Auth APIs
export const authService = {
  signup: (email, password, name) =>
    apiClient.post('/auth/signup', { email, password, name }),
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  forgotPassword: (email) =>
    apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (otp, password, email) =>
    apiClient.post('/auth/reset-password', { email, otp, password }),
};

// Food APIs
export const foodService = {
  getAllFoods: () => apiClient.get('/foods'),
  getFoodById: (id) => apiClient.get(`/foods/${id}`),
  getRestaurants: () => apiClient.get('/restaurants'),
  getRestaurantById: (id) => apiClient.get(`/restaurants/${id}`),
};

// Cart APIs
export const cartService = {
  addToCart: (foodId, quantity) =>
    apiClient.post('/cart/add', { foodId, quantity }),
  getCart: () => apiClient.get('/cart'),
  updateCartItem: (cartItemId, quantity) =>
    apiClient.put(`/cart/${cartItemId}`, { quantity }),
  removeFromCart: (cartItemId) =>
    apiClient.delete(`/cart/${cartItemId}`),
  clearCart: () => apiClient.delete('/cart'),
};

// Order APIs
export const orderService = {
  createOrder: (items, totalPrice, deliveryLocation) =>
    apiClient.post('/orders', { items, totalPrice, deliveryLocation }),
  getOrders: () => apiClient.get('/orders'),
  getOrderById: (id) => apiClient.get(`/orders/${id}`),
};

// Profile APIs
export const profileService = {
  getProfile: () => apiClient.get('/profile'),
  updateProfile: (data) => apiClient.put('/profile', data),
  updateAvatar: (formData) =>
    apiClient.put('/profile/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (currentPassword, newPassword) =>
    apiClient.put('/profile/password', { currentPassword, newPassword }),
  getOrderHistory: () => apiClient.get('/profile/orders'),
  deleteAccount: () => apiClient.delete('/profile'),
};