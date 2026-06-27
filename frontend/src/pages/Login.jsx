import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaEnvelope,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaLock,
  FaShieldAlt,
  FaShoppingBag,
  FaTruck,
  FaUtensils,
} from 'react-icons/fa';
import { authService } from '../services';
import { storeAuthToken, validateEmail } from '../utils/helpers';

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: 18,
    transition: { duration: 0.22, ease: 'easeIn' },
  },
};

const formVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.05, duration: 0.28, ease: 'easeOut' },
  }),
};



const highlights = [
  { icon: FaTruck, label: 'Quick delivery' },
  { icon: FaShieldAlt, label: 'Secure account' },
  { icon: FaUtensils, label: 'Fresh meals' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const backendUrl = apiUrl.replace(/\/api\/?$/, '');
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateEmail(email)) {
      setError('Tanga imeri ikora neza.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Ijambobanga rigomba kuba nibura inyuguti 6.');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login(email, password);
      storeAuthToken(response.data.data.token, response.data.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Kwinjira byanze, gerageza kongera.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-950">
      <img
        src="/123.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-emerald-950/95 to-slate-900" />
      <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-black/35 to-transparent" />

      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        {/* Left hero panel */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="hidden text-white lg:block"
        >
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur-xl">
            <FaShoppingBag aria-hidden="true" className="text-emerald-300" />
            Good food, good mood
          </div>

          <h1 className="max-w-xl text-5xl font-black leading-tight">
            Injira muri NTUMA, wishimire gutumiza byoroshye.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-200">
            Konti yawe igufasha kubika ibyo ukunda, gukurikirana ibyo watumije, no kubona amafunguro agezweho hafi yawe.
          </p>

          <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
                  <Icon aria-hidden="true" className="mb-3 text-xl text-amber-300" />
                  <p className="text-sm font-bold text-white">{item.label}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right form panel */}
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="mx-auto w-full max-w-[500px]"
        >
          <div className="rounded-lg border border-white/70 bg-white/95 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95 sm:p-7">
            <div className="mb-5">
              <p className="mb-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">Welcome back</p>
              <h2 className="text-3xl font-black leading-tight text-slate-950 dark:text-white">Murakaza neza</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Injira ukomeze gutumiza amafunguro ukunda.
              </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-5 flex items-start gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200"
                >
                  <FaExclamationCircle aria-hidden="true" className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-3">
              <motion.div custom={0} variants={formVariants} initial="hidden" animate="visible">
                <label htmlFor="login-email" className="mb-1.5 block text-sm font-bold text-slate-800 dark:text-slate-200">
                  Imeri
                </label>
                <div className="relative">
                  <FaEnvelope
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-[52px] w-full rounded-lg border border-slate-200 bg-slate-50 pl-12 pr-4 text-base font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white dark:border-white/10 dark:bg-slate-950/70 dark:text-white dark:focus:border-emerald-400"
                    placeholder="champion@email.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </motion.div>

              <motion.div custom={1} variants={formVariants} initial="hidden" animate="visible">
                <label htmlFor="login-password" className="mb-1.5 block text-sm font-bold text-slate-800 dark:text-slate-200">
                  Ijambobanga
                </label>
                <div className="relative">
                  <FaLock
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-[52px] w-full rounded-lg border border-slate-200 bg-slate-50 pl-12 pr-12 text-base font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white dark:border-white/10 dark:bg-slate-950/70 dark:text-white dark:focus:border-emerald-400"
                    placeholder="Andika ijambobanga"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                custom={2}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap items-center justify-between gap-3 pt-1"
              >
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Remember me
                </label>
              </motion.div>

              <motion.button
                custom={3}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                whileHover={!loading ? { y: -1 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                type="submit"
                disabled={loading}
                className="flex h-[52px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-5 text-base font-black text-white shadow-lg shadow-emerald-900/20 hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-3">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Kwinjira...
                  </span>
                ) : (
                  'Injira'
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">or continue with</span>
              <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
            </div>

            {/* Google OAuth — single full-width button */}
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleGoogleLogin}
              className="flex h-[52px] w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700 shadow-sm hover:border-red-400 hover:text-red-600 hover:shadow-md transition-all duration-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:border-red-400/60"
            >
              <FaGoogle aria-hidden="true" className="text-lg" />
              Continue with Google
            </motion.button>

            <p className="mt-5 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
              Ntabwo ufite konti?{' '}
              <Link to="/signup" className="font-black text-emerald-700 hover:text-emerald-900 dark:text-emerald-300">
                Iyandikishe
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}