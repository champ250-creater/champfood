import { motion } from 'framer-motion';

export default function EmptyState({ title, description, icon = '📭' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-dark mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md">{description}</p>
    </motion.div>
  );
}
