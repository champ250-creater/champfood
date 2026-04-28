import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services';
import { storeAuthToken, validateEmail } from '../utils/helpers';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name) {
      setError('izina rirakenewe');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Tanga email ikora neza.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Ijambobanga rigomba kuba nibura inyuguti 6');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Amagambo y\'ibanga ntahuye');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.signup(email, password, name);
      // FIXED: Added .data.data to correctly grab the token and user!
      storeAuthToken(response.data.data.token, response.data.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Kwiyandikisha byanze gerageza kongera.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-primary px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center mb-2 text-dark">Injira NZANIRA</h1>
        <p className="text-center text-gray-600 mb-8">Kora konti hanyuma utangire gutumiza</p>

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
            <label className="block text-dark font-semibold mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition"
              placeholder="ishimwe aime"
            />
          </div>

          <div>
            <label className="block text-dark font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition"
              placeholder="andikaemail yawe@email.com"
            />
          </div>

          <div>
            <label className="block text-dark font-semibold mb-2">IJAMBOBANGA</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition"
              placeholder="******"
            />
          </div>

          <div>
            <label className="block text-dark font-semibold mb-2">Emeza ijambo banga</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary transition"
              placeholder="******"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3 rounded-lg hover:shadow-lg transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Kurema konti...' : 'IYANDIKISHE'}
          </motion.button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Umaze kugira konti?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}