import { Router } from 'express';
import OrderController from '../controllers/orderController.js';
import authenticateToken from '../middleware/auth.js';

const router = Router();

// Protect all order routes
router.use(authenticateToken);

router.post('/', OrderController.createOrder);
router.get('/', OrderController.getUserOrders);
router.get('/:id', OrderController.getOrderById);
router.put('/:id/status', OrderController.updateOrderStatus);

export default router;
