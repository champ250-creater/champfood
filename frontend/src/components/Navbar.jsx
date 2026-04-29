import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStoredUser, clearAuth } from '../utils/helpers';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // --- DARK MODE LOGIC ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  // -----------------------

  const updateUser = () => {
    const storedUser = getStoredUser();
    setUser(storedUser);
  };

  useEffect(() => {
    updateUser();
  }, [location.pathname]); 

  useEffect(() => {
    window.addEventListener('storage', updateUser);
    return () => window.removeEventListener('storage', updateUser);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      // Added dark: classes here!
      className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 dark:border-slate-700/50 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-[0_4px_10px_rgba(20,184,166,0.3)] group-hover:rotate-6 transition-transform duration-300">
              <span className="text-white font-extrabold text-lg">N</span>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white transition-colors">
              NZAN<span className="text-teal-500">IRA</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-slate-600 dark:text-slate-300 font-bold hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300">
              Ahabanza
            </Link>
            {user && (
              <>
                <Link to="/cart" className="text-slate-600 dark:text-slate-300 font-bold hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300">
                  IBYATORANYIJWE
                </Link>
                <Link to="/orders" className="text-slate-600 dark:text-slate-300 font-bold hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300">
                  Ibyo natumije
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            
            {/* DARK MODE TOGGLE BUTTON */}
            <button 
              onClick={toggleTheme}
              className="p-2 mr-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:scale-110 transition-all"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>

            {user ? (
              <div className="flex items-center gap-3 sm:gap-6">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 py-1.5 rounded-full shadow-sm">
                  <div className="w-7 h-7 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold uppercase ring-2 ring-white dark:ring-slate-900">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 hidden sm:inline">
                    {user.name ? user.name.split(' ')[0] : 'User'}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="bg-transparent hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 border border-transparent hover:border-red-100 dark:hover:border-red-900/50"
                >
                  Sohoka
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-slate-600 dark:text-slate-300 font-bold px-4 py-2 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300"
                >
                  Injira
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-[0_4px_14px_0_rgba(20,184,166,0.3)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.2)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Iyandikishe
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-teal-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-100 dark:border-slate-700 py-4 space-y-2 overflow-hidden"
            >
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-400 font-bold rounded-lg transition-colors"
              >
                Ahabanza
              </Link>
              {user && (
                <>
                  <Link 
                    to="/cart" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-400 font-bold rounded-lg transition-colors"
                  >
                    IBYATORANYIJWE
                  </Link>
                  <Link 
                    to="/orders" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-700 dark:hover:text-teal-400 font-bold rounded-lg transition-colors"
                  >
                    Ibyo natumije
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}