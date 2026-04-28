import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
      setError('Guhitamo ibyatoranyijwe byanze. Gerageza kongera.');
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
      setError('Kuvugurura ibyatoranyijwe byanze.');
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await cartService.removeFromCart(cartItemId);
      setCart(cart.filter((item) => item.id !== cartItemId));
    } catch (err) {
      console.error(err);
      setError('Gukuramo ifunguro byanze.');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Ese urashaka gusiba ibyatoranyijwe byose?')) return;

    try {
      await cartService.clearCart();
      setCart([]);
    } catch (err) {
      console.error(err);
      setError('Gusiba ibyatoranyijwe byanze.');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  if (loading) return <LoadingSpinner />;

  // Empty State with Dark Mode integration
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-light dark:bg-dark py-12 px-4 transition-colors duration-500 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-[#222222] rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-gray-100 dark:border-gray-800 transition-colors duration-500">
          <EmptyState
            title="Nta byatoranyijwe bihari"
            description="Shyiramo amafunguro wakunze mu bihari hanyuma utangire gutumiza!"
            icon="🛒"
          />
          <div className="text-center mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="w-full bg-primary hover:bg-secondary text-white font-bold px-8 py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(32,194,105,0.3)] transition-all duration-300"
            >
              Komeza guhaha
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  const total = calculateTotal();
  const deliveryFee = 500.99;
  const tax = total * 0.5;
  const finalTotal = total + deliveryFee + tax;

  return (
    // Main Container
    <div className="min-h-screen bg-light dark:bg-dark py-12 px-4 transition-colors duration-500 relative overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-4xl font-extrabold text-dark dark:text-light mb-8 transition-colors">
          Ibyatoranyijwe
        </h1>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl mb-8 flex items-center shadow-sm border border-red-100 dark:border-red-800/50"
            >
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List of Selected Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#222222] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-500">
              <motion.div className="divide-y divide-gray-100 dark:divide-gray-800 transition-colors">
                <AnimatePresence>
                  {cart.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.05 }}
                      className="p-6 flex gap-5 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                    >
                      <img
                        src={item.image || 'https://via.placeholder.com/100x100?text=Food'}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl shadow-sm"
                      />

                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg text-dark dark:text-light transition-colors">{item.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{item.restaurantName}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-extrabold text-lg text-primary dark:text-primary">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-2">
                          {/* Stepper Control */}
                          <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="px-4 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              −
                            </button>
                            <span className="px-4 py-1.5 font-bold text-dark dark:text-light bg-gray-50 dark:bg-gray-800/50 border-x-2 border-gray-200 dark:border-gray-700 transition-colors">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="px-4 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-600 text-sm font-bold tracking-wide uppercase transition-colors"
                          >
                            Kuramo
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-600 font-bold uppercase tracking-wide text-sm transition-colors py-2 px-4 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Siba Byose
              </button>
            </div>
          </div>

          {/* Order Summary Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
            className="bg-white dark:bg-[#222222] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-gray-100 dark:border-gray-800 p-8 h-fit sticky top-24 transition-colors duration-500"
          >
            <h2 className="text-2xl font-extrabold text-dark dark:text-light mb-6 transition-colors">Incamake y'ibyo uguze</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600 dark:text-gray-400 font-medium">
                <span>Igiteranyo</span>
                <span className="text-dark dark:text-light font-bold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400 font-medium">
                <span>Ikiguzi cyo kugezwaho</span>
                <span className="text-dark dark:text-light font-bold">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400 font-medium">
                <span>Umusoro</span>
                <span className="text-dark dark:text-light font-bold">{formatPrice(tax)}</span>
              </div>
              <div className="border-t-2 border-gray-100 dark:border-gray-800 pt-5 mt-5 flex justify-between items-center transition-colors">
                <span className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-sm">Igiteranyo Rusange</span>
                <span className="font-extrabold text-2xl text-primary dark:text-primary">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  navigate('/order', {
                    state: { items: cart, subtotal: total, delivery: deliveryFee, tax: tax, total: finalTotal },
                  })
                }
                className="w-full relative overflow-hidden bg-primary hover:bg-secondary text-white font-bold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(32,194,105,0.3)] transition-all duration-300 group"
              >
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                <span className="relative z-10">Emeza komande</span>
              </motion.button>

              <button
                onClick={() => navigate('/')}
                className="w-full border-2 border-primary text-primary font-bold py-3.5 rounded-xl hover:bg-primary/10 dark:hover:bg-primary/20 transition duration-300"
              >
                Komeza guhaha
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}