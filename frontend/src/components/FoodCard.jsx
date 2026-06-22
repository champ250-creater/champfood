import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaClock, FaStar, FaStore } from 'react-icons/fa';
import { formatPrice } from '../utils/helpers';

export default function FoodCard({ food }) {
  const isSample = String(food.id).startsWith('sample-');
  const detailLink = isSample ? '/contact' : `/food/${food.id}`;
  const price = Number(food.price || 0);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="group h-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-300 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/10 dark:border-white/10 dark:bg-white/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={food.image || 'https://via.placeholder.com/600x450?text=NTUMA'}
          alt={food.name || 'Ifunguro rya NTUMA'}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-800 shadow-sm">
          {formatPrice(price)}
        </div>
      </div>

      <div className="flex flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-lg font-black text-slate-950 dark:text-white">
            <span className="line-clamp-1">{food.name || 'Ifunguro'}</span>
          </h3>
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700">
            <FaStar aria-hidden="true" />
            {food.rating || '4.5'}
          </div>
        </div>

        <p className="mb-4 min-h-[3rem] text-sm leading-6 text-slate-600 line-clamp-2 dark:text-slate-300">
          {food.description || 'Ibisobanuro birambuye by iri funguro.'}
        </p>

        <div className="mb-5 grid gap-2 text-xs font-bold text-slate-500 dark:text-slate-300">
          <span className="flex items-center gap-2">
            <FaStore className="text-emerald-600" aria-hidden="true" />
            <span className="truncate">{food.restaurantName || 'NTUMA'}</span>
          </span>
          <span className="flex items-center gap-2">
            <FaClock className="text-emerald-600" aria-hidden="true" />
            20-30 min
          </span>
        </div>

        <Link
          to={detailLink}
          className="focus-ring mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-black text-white hover:bg-emerald-800"
        >
          {isSample ? 'Saba ibisobanuro' : 'Reba ibisobanuro'}
          <FaArrowRight aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  );
}
