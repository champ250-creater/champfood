import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FoodCard from '../components/FoodCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { foodService } from '../services';

const StatItem = ({ target, label, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    const duration = 60000; 
    const incrementTime = duration / end;

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="flex flex-col items-center">
      <motion.div 
        animate={{ color: ["#10b981", "#3b82f6", "#f97316", "#10b981"] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="text-4xl md:text-5xl font-bold mb-2"
      >
        {count}{suffix}
      </motion.div>
      <p className="text-gray-400 font-medium tracking-wide">{label}</p>
    </div>
  );
};

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await foodService.getAllFoods();
      setFoods(response.data.data || []);
    } catch (err) {
      setError('Failed to load foods');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFoods = foods.filter(
    (food) =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    // ADDED dark:bg-slate-900 here!
    <div className="min-h-screen bg-light dark:bg-slate-900 transition-colors duration-300">
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary via-accent to-primary text-white py-20 px-4"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Tuma ibiryo ukunda cyane
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Gutanga byihuse, amafunguro mashya, n'ibiciro byiza
          </p>

          <motion.div whileHover={{ scale: 1.05 }} className="flex max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Shaka ibiryo, n'resitora..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-6 py-4 rounded-l-lg text-dark focus:outline-none"
            />
            <button className="bg-secondary hover:bg-opacity-90 text-white px-8 py-4 rounded-r-lg font-semibold transition">
              Search
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-100 text-red-700 p-4 rounded-lg mb-8">
            {error}
          </motion.div>
        )}

        {filteredFoods.length === 0 ? (
          <EmptyState
            title="No Foods Found"
            description="Nta biribwa twabonye bihuye n'ibyo washakaga. Gerageza irindi jambo ryo gushakisha."
            icon="🍽️"
          />
        ) : (
          <>
            {/* ADDED dark:text-white here! */}
            <h2 className="text-3xl font-bold text-dark dark:text-white mb-8 transition-colors duration-300">
              {searchTerm ? `Search Results (${filteredFoods.length})` : 'IBIRYO Bikunzwe'}
            </h2>
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredFoods.map((food, index) => (
                <motion.div
                  key={food.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FoodCard food={food} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-dark text-white py-20 px-4 border-t border-gray-900"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <StatItem target="1" label="Restaurant Partners" suffix="+" />
          <StatItem target="500" label="Happy Customers" suffix="+" />
          <StatItem target="30" label="Average Delivery Time" suffix=" min" />
        </div>
      </motion.div>
    </div>
  );
}