import { motion } from 'framer-motion';
import { FaUtensils } from 'react-icons/fa';

export default function EmptyState({ title, description, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/70 px-6 py-20 text-center dark:border-white/20 dark:bg-white/10"
      role="status"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-200">
        {icon || <FaUtensils aria-hidden="true" />}
      </div>
      <h3 className="text-2xl font-black text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </motion.div>
  );
}
