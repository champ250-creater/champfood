import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaStar,
  FaStore,
} from 'react-icons/fa';
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
  const [message, setMessage] = useState({ type: '', text: '' });
  const user = getStoredUser();

  useEffect(() => {
    fetchFood();
  }, [id]);

  const fetchFood = async () => {
    try {
      setLoading(true);
      const response = await foodService.getFoodById(id);
      const foodData = response.data?.data || response.data || response;
      setFood(foodData);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: "Ntibyakunze kuzana ibisobanuro by'ibiryo." });
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
      setMessage({ type: 'success', text: 'Byagiye mu byatoranyijwe.' });
      setTimeout(() => {
        navigate('/cart');
      }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: 'Ntibyakunze kubishyira mu byatoranyijwe.' });
      console.error(err);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <LoadingSpinner label="Turazana ibisobanuro..." />;

  if (!food || typeof food !== 'object') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Ibiryo ntibibonetse</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Subira kuri menu cyangwa utwandikire tugufashe kubona ibyo ushaka.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 font-black text-white hover:bg-emerald-800"
        >
          <FaArrowLeft aria-hidden="true" />
          Subira kuri menu
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="focus-ring mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm hover:text-emerald-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
        >
          <FaArrowLeft aria-hidden="true" />
          Subira ahabanza
        </button>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-emerald-950/5 dark:border-white/10 dark:bg-white/10">
          <div className="grid gap-8 p-5 md:grid-cols-2 md:p-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <img
                src={food.image || 'https://via.placeholder.com/700x520?text=NTUMA'}
                alt={food.name || 'Ibiryo'}
                className="aspect-[4/3] w-full rounded-lg object-cover"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-black text-amber-700">
                  <FaStar aria-hidden="true" />
                  {food.rating || '4.5'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800">
                  <FaStore aria-hidden="true" />
                  {food.restaurantName || 'NTUMA'}
                </span>
              </div>

              <h1 className="text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">
                {food.name || 'Ifunguro'}
              </h1>
              <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
                {food.description || 'Ifunguro ryateguwe neza kandi rigeze ku mukiriya rishyushye.'}
              </p>

              <div className="my-6 rounded-lg border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-400/20 dark:bg-emerald-400/10">
                <div className="text-4xl font-black text-emerald-800 dark:text-emerald-200">
                  {formatPrice(food.price || 0)}
                </div>
                <p className="mt-1 text-sm font-semibold text-emerald-900/70 dark:text-emerald-100">
                  Igiciro kuri buri kimwe
                </p>
              </div>

              {message.text && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  role="status"
                  className={`mb-6 rounded-lg px-4 py-3 text-sm font-bold ${
                    message.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {message.text}
                </motion.div>
              )}

              <div className="mb-6 flex flex-wrap items-center gap-4">
                <span className="font-black text-slate-800 dark:text-slate-100">Umubare</span>
                <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-white/10">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 hover:bg-white dark:text-white dark:hover:bg-white/10"
                    aria-label="Gabanya umubare"
                  >
                    <FaMinus aria-hidden="true" />
                  </button>
                  <span className="min-w-12 px-4 text-center font-black text-slate-950 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 hover:bg-white dark:text-white dark:hover:bg-white/10"
                    aria-label="Ongera umubare"
                  >
                    <FaPlus aria-hidden="true" />
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={!addingToCart ? { scale: 1.02 } : {}}
                whileTap={!addingToCart ? { scale: 0.98 } : {}}
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-4 text-base font-black text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaShoppingBag aria-hidden="true" />
                {addingToCart ? 'Biri gushyirwamo...' : 'Shyira mu byatoranyijwe'}
              </motion.button>

              <div className="mt-8 grid gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                {[
                  'Ibikoresho bifite isuku ihagije',
                  'Bitegurwa byihuse kandi bikagezwa aho uri',
                  'Kwishyura no kwemeza order mu buryo bwizewe',
                ].map((item) => (
                  <p key={item} className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-600" aria-hidden="true" />
                    {item}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
