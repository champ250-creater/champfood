import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBars,
  FaMoon,
  FaShoppingBag,
  FaSignOutAlt,
  FaSun,
  FaTimes,
  FaUserShield,
} from 'react-icons/fa';
import { getStoredUser, clearAuth } from '../utils/helpers';

const publicLinks = [
  { to: '/', label: 'Ahabanza' },
  { to: '/about', label: 'Ibyerekeye' },
  { to: '/contact', label: 'Twandikire' },
];

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const updateUser = () => {
    const storedUser = getStoredUser();
    setUser(storedUser);
  };

  useEffect(() => {
    updateUser();
    setIsMenuOpen(false);
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

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `focus-ring rounded-full px-4 py-2 text-sm font-bold transition-colors ${
      isActive(path)
        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/20 dark:text-emerald-200'
        : 'text-slate-700 hover:bg-slate-100 hover:text-emerald-800 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white'
    }`;

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Jya ku bikubiyemo
      </a>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="sticky top-0 z-50 border-b border-white/70 bg-white/90 shadow-sm backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-slate-950/90"
        aria-label="Primary navigation"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-4">
            <Link to="/" className="focus-ring flex min-w-0 items-center gap-3 rounded-full" onClick={closeMenu}>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-950 p-1.5 shadow-lg ring-1 ring-emerald-300/30">
                <img
                  src="/ntuma-logo.png"
                  alt="NTUMA"
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="hidden sm:block">
                <span className="block text-lg font-black tracking-normal text-slate-950 dark:text-white">
                  NTUMA
                </span>
                <span className="block text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                  Good food Good mood
                </span>
              </span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {publicLinks.map((link) => (
                <Link key={link.to} to={link.to} className={linkClass(link.to)}>
                  {link.label}
                </Link>
              ))}
              {user && (
                <>
                  <Link to="/cart" className={linkClass('/cart')}>
                    Ibyatoranyijwe
                  </Link>
                  <Link to="/orders" className={linkClass('/orders')}>
                    Ibyo natumije
                  </Link>
                  <Link to="/admin" className={linkClass('/admin')}>
                    Admin
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/10 dark:text-amber-200 dark:hover:text-amber-100"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <FaMoon aria-hidden="true" /> : <FaSun aria-hidden="true" />}
              </button>

              {user ? (
                <div className="hidden items-center gap-2 md:flex">
                  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm dark:border-white/10 dark:bg-white/10">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-black uppercase text-white">
                      {user.name ? user.name.charAt(0) : 'U'}
                    </span>
                    <span className="max-w-28 truncate text-sm font-bold text-slate-700 dark:text-slate-100">
                      {user.name ? user.name.split(' ')[0] : 'User'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200"
                    aria-label="Sohoka"
                  >
                    <FaSignOutAlt aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <div className="hidden items-center gap-2 md:flex">
                  <Link to="/login" className="focus-ring rounded-full px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-emerald-800 dark:text-slate-200 dark:hover:bg-white/10">
                    Injira
                  </Link>
                  <Link
                    to="/signup"
                    className="focus-ring inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-800"
                  >
                    <FaShoppingBag aria-hidden="true" />
                    Tangira
                  </Link>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:text-emerald-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-100 md:hidden"
                aria-label="Fungura menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border-t border-slate-100 py-4 dark:border-white/10 md:hidden"
              >
                <div className="grid gap-2">
                  {publicLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={closeMenu}
                      className={linkClass(link.to)}
                    >
                      {link.label}
                    </Link>
                  ))}

                  {user && (
                    <>
                      <Link to="/cart" onClick={closeMenu} className={linkClass('/cart')}>
                        Ibyatoranyijwe
                      </Link>
                      <Link to="/orders" onClick={closeMenu} className={linkClass('/orders')}>
                        Ibyo natumije
                      </Link>
                      <Link to="/admin" onClick={closeMenu} className={linkClass('/admin')}>
                        <span className="inline-flex items-center gap-2">
                          <FaUserShield aria-hidden="true" />
                          Admin
                        </span>
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="focus-ring rounded-full px-4 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50 dark:text-red-200 dark:hover:bg-red-400/10"
                      >
                        Sohoka
                      </button>
                    </>
                  )}

                  {!user && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <Link
                        to="/login"
                        onClick={closeMenu}
                        className="focus-ring rounded-full border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700 dark:border-white/10 dark:text-slate-100"
                      >
                        Injira
                      </Link>
                      <Link
                        to="/signup"
                        onClick={closeMenu}
                        className="focus-ring rounded-full bg-emerald-700 px-4 py-3 text-center text-sm font-black text-white"
                      >
                        Tangira
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  );
}
