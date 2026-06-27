import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await authService.resetPassword(token, password);
      setStatus('success');
      setMessage(response.data.message || 'Ijambo ryibanga ryahinduwe neza!');
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Habaye ikibazo (Something went wrong)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Ijambo Ryibanga Rishya</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Injiza ijambo ryibanga ryawe rishya hano.
          </p>
        </div>

        {status === 'success' && (
          <motion.div className="mb-6 p-4 bg-teal-50 text-teal-700 rounded-xl text-center">
            {message}
          </motion.div>
        )}
        
        {status === 'error' && (
          <motion.div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-center">
            {message}
          </motion.div>
        )}

        {status !== 'success' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Ijambo ryibanga rishya (New Password)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                placeholder="Nibura inyuguti 6..."
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {status === 'loading' ? 'Tegereza...' : 'Emeza (Confirm)'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="text-slate-500 hover:text-teal-600 text-sm font-semibold">
            &larr; Jya ahandikirwa (Go to Login)
          </Link>
        </div>
      </motion.div>
    </div>
  );
}