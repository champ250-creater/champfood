import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services';
import { storeAuthToken, validateEmail } from '../utils/helpers';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  // ANIMATION: Uko paji yinjira n'uko isohoka
  const pageVariants = {
    initial: { opacity: 0, x: -50 }, 
    animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2, ease: "easeIn" } } 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-accent px-4 overflow-hidden">
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center mb-2 text-dark">Murakaza neza</h1>
        <p className="text-center text-gray-600 mb-8">Injira muri NZANIRA utangire gutumiza</p>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-dark font-semibold mb-2">Imeri</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition"
              placeholder="champion@email.com"
            />
          </div>

          <div>
            <label className="block text-dark font-semibold mb-2">Ijambobanga</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition"
              placeholder="******"
            />
          </div>

          {/* NEW: Forgot Password Link added here! */}
          <div className="flex justify-end mt-1 mb-2">
            <Link 
              to="/forgot-password" 
              className="text-sm font-semibold text-primary hover:text-accent transition-colors duration-300"
            >
              Wibagiwe ijambo ryibanga?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3 rounded-lg hover:shadow-lg transition duration-300 disabled:opacity-50 mt-2"
          >
            {loading ? 'Kwinjira...' : 'INJIRA'}
          </motion.button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Ntabwo ufite konti?{' '}
          <Link to="/signup" className="text-primary font-bold hover:underline">
            Iyandikishe
          </Link>
        </p>
      </motion.div>
    </div>
  );
}