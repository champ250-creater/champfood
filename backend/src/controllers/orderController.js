import OrderService from '../services/orderService.js';

class OrderController {
  static async createOrder(req, res, next) {
    try {
      const userId = req.user.userId;
      const { items, totalPrice } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Items are required',
        });
      }

      if (!totalPrice || totalPrice < 0) {
        return res.status(400).json({
          success: false,
          message: 'Total price is required',
        });
      }

      const order = await OrderService.createOrder(userId, items, totalPrice);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserOrders(req, res, next) {
    try {
      const userId = req.user.userId;
      const orders = await OrderService.getUserOrders(userId);

      res.status(200).json({
        success: true,
        message: 'Orders retrieved successfully',
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req, res, next) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id);

      res.status(200).json({
        success: true,
        message: 'Order retrieved successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required',
        });
      }

      const order = await OrderService.updateOrderStatus(id, status);

      res.status(200).json({
        success: true,
        message: 'Order status updated',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default OrderController;
