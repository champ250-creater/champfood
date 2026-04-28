import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { cartService } from '../services';
import { formatPrice } from '../utils/helpers';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCart(response.data.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(cartItemId);
      return;
    }

    try {
      await cartService.updateCartItem(cartItemId, newQuantity);
      setCart(
        cart.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error(err);
      setError('Failed to update cart');
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await cartService.removeFromCart(cartItemId);
      setCart(cart.filter((item) => item.id !== cartItemId));
    } catch (err) {
      console.error(err);
      setError('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Clear entire cart?')) return;

    try {
      await cartService.clearCart();
      setCart([]);
    } catch (err) {
      console.error(err);
      setError('Failed to clear cart');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  if (loading) return <LoadingSpinner />;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-light py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <EmptyState
            title="Your Cart is Empty"
            description="Shyiramo ibiryo biryoshye mu igare ryawe hanyuma utangire gutumiza!"
            icon="🛒"
          />
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-primary to-accent text-white font-bold px-8 py-3 rounded-lg hover:shadow-lg transition duration-300"
            >
              Komeza guhaha
            </button>
          </div>
        </div>
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-light py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-dark mb-8">Shopping Cart</h1>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 text-red-700 p-4 rounded-lg mb-8"
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <motion.div className="divide-y">
                {cart.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 flex gap-4"
                  >
                    <img
                      src={item.image || 'https://via.placeholder.com/100x100?text=Food'}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-dark mb-2">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{item.restaurantName}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border-2 border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-3 py-1 hover:bg-light transition"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-3 py-1 hover:bg-light transition"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-lg text-primary">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-semibold mt-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <button
              onClick={handleClearCart}
              className="mt-4 text-red-500 hover:text-red-700 font-semibold"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-20"
          >
            <h2 className="text-2xl font-bold text-dark mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold">{formatPrice(2.99)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">{formatPrice(total * 0.1)}</span>
              </div>
              <div className="border-t-2 pt-4 flex justify-between">
                <span className="font-bold text-dark">Total</span>
                <span className="font-bold text-2xl text-primary">
                  {formatPrice(total + 2.99 + total * 0.1)}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                navigate('/order', {
                  state: {
                    items: cart,
                    subtotal: total,
                    delivery: 2.99,
                    tax: total * 0.1,
                    total: total + 2.99 + total * 0.1,
                  },
                })
              }
              className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3 rounded-lg hover:shadow-lg transition duration-300"
            >
              Proceed to Order
            </motion.button>

            <button
              onClick={() => navigate('/')}
              className="w-full mt-3 border-2 border-primary text-primary font-semibold py-3 rounded-lg hover:bg-light transition duration-300"
            >
              komeza kugura  
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
