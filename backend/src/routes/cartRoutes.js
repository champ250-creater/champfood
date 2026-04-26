import { Router } from 'express';
import CartController from '../controllers/cartController.js';
import authenticateToken from '../middleware/auth.js';

const router = Router();

// Protect all cart routes
router.use(authenticateToken);

router.post('/add', CartController.addToCart);
router.get('/', CartController.getCart);
router.put('/:cartItemId', CartController.updateCartItem);
router.delete('/:cartItemId', CartController.removeFromCart);
router.delete('/', CartController.clearCart);

export default router;
