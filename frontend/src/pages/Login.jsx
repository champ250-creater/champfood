import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services';
import { storeAuthToken, validateEmail } from '../utils/helpers';

// 1. Upgraded Physics: Using springs instead of linear easing for a tactile, premium feel
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 1,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 120, damping: 20 } 
  },
};

const errorVariants = {
  hidden: { opacity: 0, height: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    height: "auto",
    scale: 1, 
    x: [0, -6, 6, -6, 6, 0], // Refined shake
    transition: { duration: 0.4, type: "spring", stiffness: 200 } 
  },
  exit: { opacity: 0, height: 0, scale: 0.9, transition: { duration: 0.2 } }
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const navigate = useNavigate();

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
      setError('Ijambobanga rigomba kuba nibura inyuguti 6');
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
    // Rich, animated gradient background that slowly shifts
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 via-slate-900 to-indigo-900 px-4 overflow-hidden relative">
      
      {/* Decorative blurred orbs for spatial depth */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        // Glassmorphism card: semi-transparent white with backdrop blur and subtle border
        className="bg-white/90 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.25)] rounded-3xl p-8 w-full max-w-md relative z-10"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-teal-700 to-indigo-700 bg-clip-text text-transparent">
            Murakaza neza
          </h1>
          <p className="text-center text-slate-500 mb-8 font-medium">Injira muri NZANIRA utangire gutumiza</p>
        </motion.div>

        {/* AnimatePresence allows the error to smoothly collapse when it disappears */}
        <AnimatePresence>
          {error && (
            <motion.div
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-red-50/80 backdrop-blur-sm text-red-600 p-4 rounded-xl mb-6 text-sm font-semibold border border-red-100 shadow-sm flex items-center"
            >
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div variants={itemVariants}>
            <label className="block text-slate-700 font-bold mb-2 text-sm uppercase tracking-wider">Imeri</label>
            <div className={`relative transition-all duration-300 ${focusedInput === 'email' ? 'scale-[1.02] shadow-lg shadow-teal-500/10' : ''}`}>
              <input
                type="email"
                value={email}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-teal-500 transition-colors duration-300 font-medium text-slate-800 placeholder-slate-400"
                placeholder="andikaemail yawe@email.com"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-slate-700 font-bold mb-2 text-sm uppercase tracking-wider">Ijambobanga</label>
            <div className={`relative transition-all duration-300 ${focusedInput === 'password' ? 'scale-[1.02] shadow-lg shadow-teal-500/10' : ''}`}>
              <input
                type="password"
                value={password}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-teal-500 transition-colors duration-300 font-medium text-slate-800 placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-2">
            <motion.button
              whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(20,184,166,0.39)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.23)] hover:from-teal-400 hover:to-indigo-500 transition-all duration-300 disabled:opacity-80 disabled:cursor-not-allowed group"
            >
              {/* Button shine effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
              
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Kwinjira...
                  </>
                ) : 'INJIRA'}
              </span>
            </motion.button>
          </motion.div>
        </form>

        <motion.p variants={itemVariants} className="text-center mt-8 text-slate-500 font-medium">
          Ntabwo ufite konti?{' '}
          <Link to="/signup" className="text-teal-600 font-bold hover:text-indigo-600 transition-colors duration-300">
            Iyandikishe
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}