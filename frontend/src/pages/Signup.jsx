import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services';
import { storeAuthToken, validateEmail } from '../utils/helpers';

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20, mass: 1, when: "beforeChildren", staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 20 } },
};

const errorVariants = {
  hidden: { opacity: 0, height: 0, scale: 0.9 },
  visible: { opacity: 1, height: "auto", scale: 1, x: [0, -6, 6, -6, 6, 0], transition: { duration: 0.4, type: "spring", stiffness: 200 } },
  exit: { opacity: 0, height: 0, scale: 0.9, transition: { duration: 0.2 } }
};

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name) return setError('izina rirakenewe', setLoading(false));
    if (!validateEmail(email)) return setError('Tanga imeri ikora neza.', setLoading(false));
    if (password.length < 6) return setError('Ijambobanga rigomba kuba nibura inyuguti 6', setLoading(false));
    if (password !== confirmPassword) return setError('Amagambo y\'ibanga ntahuye', setLoading(false));

    try {
      const response = await authService.signup(email, password, name);
      storeAuthToken(response.data.data.token, response.data.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Kwiyandikisha byanze, gerageza kongera.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light dark:bg-dark px-4 py-12 transition-colors duration-500 relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-[#222222] shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-gray-100 dark:border-gray-800 rounded-3xl p-8 w-full max-w-md relative z-10 transition-colors duration-500"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-extrabold text-center mb-2 text-dark dark:text-light transition-colors">
            Iyandikishe muri NZANIRA
          </h1>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8 font-medium transition-colors">Kora konti hanyuma utangire gutumiza</p>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div variants={errorVariants} initial="hidden" animate="visible" exit="exit" className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-semibold border border-red-100 dark:border-red-800/50 flex items-center shadow-sm">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Fields - mapped with dark mode colors */}
          {[
            { label: 'Amazina', type: 'text', val: name, setVal: setName, id: 'name', placeholder: 'ishimwe aime' },
            { label: 'Imeri', type: 'email', val: email, setVal: setEmail, id: 'email', placeholder: 'andikaemail yawe@email.com' },
            { label: 'Ijambobanga', type: 'password', val: password, setVal: setPassword, id: 'password', placeholder: '••••••••' },
            { label: 'Emeza ijambobanga', type: 'password', val: confirmPassword, setVal: setConfirmPassword, id: 'confirm', placeholder: '••••••••' }
          ].map((field) => (
            <motion.div key={field.id} variants={itemVariants}>
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1.5 text-xs uppercase tracking-widest transition-colors">{field.label}</label>
              <div className={`relative transition-all duration-300 ${focusedInput === field.id ? 'scale-[1.015] shadow-lg shadow-primary/10' : ''}`}>
                <input
                  type={field.type}
                  value={field.val}
                  onFocus={() => setFocusedInput(field.id)}
                  onBlur={() => setFocusedInput(null)}
                  onChange={(e) => field.setVal(e.target.value)}
                  className="w-full px-5 py-3.5 bg-gray-50 dark:bg-[#1A1A1A] border-2 border-transparent rounded-xl focus:outline-none focus:bg-white dark:focus:bg-[#222222] focus:border-primary dark:focus:border-primary transition-all duration-300 font-medium text-dark dark:text-light placeholder-gray-400 dark:placeholder-gray-600"
                  placeholder={field.placeholder}
                />
              </div>
            </motion.div>
          ))}

          <motion.div variants={itemVariants} className="pt-4">
            <motion.button
              whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden bg-primary hover:bg-secondary text-white font-bold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(32,194,105,0.3)] transition-all duration-300 disabled:opacity-80 group"
            >
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
              <span className="relative z-10 flex items-center justify-center tracking-wide">
                {loading ? 'Kwiyandikisha...' : 'IYANDIKISHE'}
              </span>
            </motion.button>
          </motion.div>
        </form>

        <motion.p variants={itemVariants} className="text-center mt-8 text-gray-500 dark:text-gray-400 font-medium transition-colors">
          Umaze kugira konti?{' '}
          <Link to="/login" className="text-primary font-bold hover:text-secondary transition-colors duration-300">
            Injira
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}