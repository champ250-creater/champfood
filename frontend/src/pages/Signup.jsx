import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaApple,
  FaEnvelope,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
  FaFacebookF,
  FaGoogle,
  FaLinkedinIn,
  FaLock,
  FaShieldAlt,
  FaShoppingBag,
  FaTruck,
  FaUser,
  FaUtensils,
} from 'react-icons/fa';
import { authService } from '../services';
import { storeAuthToken, validateEmail } from '../utils/helpers';

const containerVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.04 },
  },
  exit: { opacity: 0, y: 18, transition: { duration: 0.22, ease: 'easeIn' } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
};

const socialProviders = [
  { name: 'Google', icon: FaGoogle },
  { name: 'Facebook', icon: FaFacebookF },
  { name: 'LinkedIn', icon: FaLinkedinIn },
  { name: 'Apple', icon: FaApple },
];

const benefits = [
  { icon: FaTruck, label: 'Fast delivery' },
  { icon: FaShieldAlt, label: 'Protected profile' },
  { icon: FaUtensils, label: 'Local favorites' },
];

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name.trim()) {
      setError('Izina rirakenewe.');
      setLoading(false);
      return;
    }

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

    if (password !== confirmPassword) {
      setError("Amagambo y'ibanga ntahuye.");
      setLoading(false);
      return;
    }

    try {
      const response = await authService.signup(email, password, name.trim());
      storeAuthToken(response.data.data.token, response.data.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Kwiyandikisha byanze, gerageza kongera.');
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

      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center gap-10 px-4 py-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="mx-auto w-full max-w-[520px] lg:order-1"
        >
          <div className="rounded-lg border border-white/70 bg-white/95 p-5 shadow-[0_28px_80px_rgba(15,23,42,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95 sm:p-6">
            <motion.div variants={itemVariants} className="mb-4">
              <p className="mb-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">Create your account</p>
              <h1 className="text-2xl font-black leading-tight text-slate-950 dark:text-white sm:text-3xl">
                Iyandikishe muri NTUMA
              </h1>
              <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Fungura konti, ubike ibyo ukunda, hanyuma utumize amafunguro vuba.
              </p>
            </motion.div>

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
              <motion.div variants={itemVariants}>
                <label htmlFor="signup-name" className="mb-1.5 block text-sm font-bold text-slate-800 dark:text-slate-200">
                  Amazina
                </label>
                <div className="relative">
                  <FaUser
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="focus-ring h-[50px] w-full rounded-lg border border-slate-200 bg-slate-50 pl-12 pr-4 text-base font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white dark:border-white/10 dark:bg-slate-950/70 dark:text-white dark:focus:border-emerald-400"
                    placeholder="Amazina yawe"
                    autoComplete="name"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="signup-email" className="mb-1.5 block text-sm font-bold text-slate-800 dark:text-slate-200">
                  Imeri
                </label>
                <div className="relative">
                  <FaEnvelope
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="focus-ring h-[50px] w-full rounded-lg border border-slate-200 bg-slate-50 pl-12 pr-4 text-base font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white dark:border-white/10 dark:bg-slate-950/70 dark:text-white dark:focus:border-emerald-400"
                    placeholder="champion@email.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </motion.div>

              <div className="grid gap-3 sm:grid-cols-2">
                <motion.div variants={itemVariants}>
                  <label htmlFor="signup-password" className="mb-1.5 block text-sm font-bold text-slate-800 dark:text-slate-200">
                    Ijambobanga
                  </label>
                  <div className="relative">
                    <FaLock
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="focus-ring h-[50px] w-full rounded-lg border border-slate-200 bg-slate-50 pl-12 pr-12 text-base font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white dark:border-white/10 dark:bg-slate-950/70 dark:text-white dark:focus:border-emerald-400"
                      placeholder="Nibura 6"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="focus-ring absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="signup-confirm-password" className="mb-1.5 block text-sm font-bold text-slate-800 dark:text-slate-200">
                    Emeza
                  </label>
                  <div className="relative">
                    <FaLock
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="focus-ring h-[50px] w-full rounded-lg border border-slate-200 bg-slate-50 pl-12 pr-12 text-base font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white dark:border-white/10 dark:bg-slate-950/70 dark:text-white dark:focus:border-emerald-400"
                      placeholder="Subiramo"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      className="focus-ring absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
                    </button>
                  </div>
                </motion.div>
              </div>

              <motion.button
                variants={itemVariants}
                whileHover={!loading ? { y: -1 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                type="submit"
                disabled={loading}
                className="focus-ring flex h-[50px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-5 text-base font-black text-white shadow-lg shadow-emerald-900/20 hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-3">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Kwiyandikisha...
                  </span>
                ) : (
                  'Create Account'
                )}
              </motion.button>
            </form>

            <div className="my-3 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
              <span className="text-sm font-black text-slate-400">or continue with</span>
              <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
            </div>

            <div className="grid grid-cols-4 gap-3">
              {socialProviders.map((provider) => {
                const Icon = provider.icon;
                return (
                  <button
                    key={provider.name}
                    type="button"
                    className="focus-ring flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg text-slate-700 shadow-sm hover:border-emerald-300 hover:text-emerald-700 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:border-emerald-400/50"
                    aria-label={`Continue with ${provider.name}`}
                    title={provider.name}
                  >
                    <Icon aria-hidden="true" />
                  </button>
                );
              })}
            </div>

            <motion.p variants={itemVariants} className="mt-4 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
              Umaze kugira konti?{' '}
              <Link to="/login" className="font-black text-emerald-700 hover:text-emerald-900 dark:text-emerald-300">
                Injira
              </Link>
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="hidden text-white lg:order-2 lg:block"
        >
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur-xl">
            <FaShoppingBag aria-hidden="true" className="text-emerald-300" />
            Tangira gutumiza uyu munsi
          </div>

          <h2 className="max-w-xl text-5xl font-black leading-tight">
            Konti nziza ituma ibyo ukunda bikugeraho vuba.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-200">
            Wiyandikishe rimwe, ubone uburyo bworoshye bwo guhitamo, kubika no gukurikirana ibyo watumije.
          </p>

          <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">
            {benefits.map((item) => {
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
      </div>
    </section>
  );
}
