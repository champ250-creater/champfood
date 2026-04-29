import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import { foodService, cartService } from '../services';
import { formatPrice, getStoredUser } from '../utils/helpers';

export default function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState('');
  const user = getStoredUser();

  useEffect(() => {
    fetchFood();
  }, [id]);

  const fetchFood = async () => {
    try {
      setLoading(true);
      const response = await foodService.getFoodById(id);
      
      // CRITICAL FIX: Ensure we are setting the actual food object, 
      // regardless of how your backend nests the response.
      const foodData = response.data?.data || response.data || response;
      setFood(foodData);
      
    } catch (err) {
      console.error(err);
      setMessage('Ntibyakunze kuzana ibisobanuro by\'ibiryo');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setAddingToCart(true);
      await cartService.addToCart(id, quantity);
      setMessage('Byagiye mu igare! ✓');
      setTimeout(() => {
        navigate('/cart');
      }, 1500);
    } catch (err) {
      setMessage('Ntibyakunze kubishyira mu igare');
      console.error(err);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  
  // CRITICAL FIX: Prevent crash if food object is empty/undefined
  if (!food || typeof food !== 'object') return <div className="text-center py-20">Ibiryo ntibibonetse</div>;

  return (
    <div className="min-h-screen bg-light py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.button
          onClick={() => navigate('/')}
          className="mb-6 text-primary font-semibold hover:underline"
        >
          ← Subira Ahabanza
        </motion.button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <img
                src={food.image || 'https://via.placeholder.com/500x400?text=Ibiryo'}
                alt={food.name || 'Ibiryo'}
                className="w-full h-96 object-cover rounded-xl"
              />
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Added fallback for food.name */}
              <h1 className="text-4xl font-bold text-dark mb-4">{food.name || 'Ibiryo'}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-2xl">★</span>
                  <span className="text-xl font-semibold">{food.rating || '4.5'}</span>
                </div>
                <span className="text-gray-600">
                  Resitora: {food.restaurantName || 'Nzanira'}
                </span>
              </div>

              <p className="text-gray-600 text-lg mb-6">{food.description}</p>

              <div className="bg-light p-6 rounded-lg mb-6">
                <div className="text-4xl font-bold text-primary mb-2">
                  {/* Added fallback for food.price */}
                  {formatPrice(food.price || 0)}
                </div>
                <p className="text-gray-600">Buri kimwe</p>
              </div>

              {message && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-3 rounded-lg mb-6 ${
                    message.includes('✓')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {message}
                </motion.div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-semibold">Umubare:</span>
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-light transition"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-light transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-4 rounded-lg hover:shadow-lg transition duration-300 disabled:opacity-50 text-lg"
              >
                {addingToCart ? 'Biri kujya mu igare...' : 'Shyira mu igare'}
              </motion.button>

              {/* Additional Info */}
              <div className="mt-8 space-y-2 text-sm text-gray-600">
                <p>✓ Ibikoresho bicyeye meza neza</p>
                <p>✓ Bitegurwa byihuse</p>
                <p>✓ Kwishyura mu mutekano ukoresheje WhatsApp</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}