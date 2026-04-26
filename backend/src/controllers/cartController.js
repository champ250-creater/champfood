import CartService from '../services/cartService.js';

class CartController {
  static async addToCart(req, res, next) {
    try {
      const { foodId, quantity } = req.body;
      const userId = req.user.userId;

      if (!foodId || !quantity) {
        return res.status(400).json({
          success: false,
          message: 'Food ID and quantity are required',
        });
      }

      const cartItem = await CartService.addToCart(userId, foodId, quantity);

      res.status(201).json({
        success: true,
        message: 'Item added to cart',
        data: cartItem,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCart(req, res, next) {
    try {
      const userId = req.user.userId;
      const cart = await CartService.getCart(userId);

      res.status(200).json({
        success: true,
        message: 'Cart retrieved successfully',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCartItem(req, res, next) {
    try {
      const { cartItemId } = req.params;
      const { quantity } = req.body;

      if (quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be at least 1',
        });
      }

      const cartItem = await CartService.updateCartItem(cartItemId, quantity);

      res.status(200).json({
        success: true,
        message: 'Cart item updated',
        data: cartItem,
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeFromCart(req, res, next) {
    try {
      const { cartItemId } = req.params;
      await CartService.removeFromCart(cartItemId);

      res.status(200).json({
        success: true,
        message: 'Item removed from cart',
      });
    } catch (error) {
      next(error);
    }
  }

  static async clearCart(req, res, next) {
    try {
      const userId = req.user.userId;
      await CartService.clearCart(userId);

      res.status(200).json({
        success: true,
        message: 'Cart cleared',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CartController;
