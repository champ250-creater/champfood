import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FoodCard from '../components/FoodCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { foodService } from '../services';

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
    <div className="min-h-screen bg-light">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary via-accent to-primary text-white py-20 px-4"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Order Your Favorite Food
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Fast delivery, fresh meals, and great prices
          </p>

          {/* Search Bar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex max-w-2xl mx-auto"
          >
            <input
              type="text"
              placeholder="Search for food, restaurants..."
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 text-red-700 p-4 rounded-lg mb-8"
          >
            {error}
          </motion.div>
        )}

        {filteredFoods.length === 0 ? (
          <EmptyState
            title="No Foods Found"
            description="We couldn't find any foods matching your search. Try a different search term."
            icon="🍽️"
          />
        ) : (
          <>
            <h2 className="text-3xl font-bold text-dark mb-8">
              {searchTerm ? `Search Results (${filteredFoods.length})` : 'Popular Foods'}
            </h2>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
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
        className="bg-dark text-white py-16 px-4"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">2+</div>
            <p>Restaurant Partners</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent mb-2">5+</div>
            <p>Happy Customers</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">30 min</div>
            <p>Average Delivery Time</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
