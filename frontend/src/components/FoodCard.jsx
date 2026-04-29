import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/helpers';

export default function FoodCard({ food }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={food.image || 'https://via.placeholder.com/300x200?text=Food'}
          alt={food.name}
          className="w-full h-full object-cover hover:scale-110 transition duration-500"
        />
        <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
          {formatPrice(food.price)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-dark mb-1 truncate">{food.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{food.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500">Restaurant: {food.restaurantName}</span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm font-semibold">{food.rating || '4.5'}</span>
          </div>
        </div>

        <Link
          to={`/food/${food.id}`}
          className="w-full bg-gradient-to-r from-primary to-accent text-white py-2 rounded-lg font-semibold hover:shadow-lg transition duration-300 text-center block"
        >
         Reba Ibisobanuro birambuye
        </Link>
      </div>
    </motion.div>
  );
}
