import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBars,
  FaMoon,
  FaShoppingBag,
  FaSignOutAlt,
  FaSun,
  FaTimes,
  FaUserShield,
  FaUser,
  FaBoxOpen,
  FaLock,
  FaChevronDown,
} from 'react-icons/fa';
import { getStoredUser, clearAuth } from '../utils/helpers';

const publicLinks = [
  { to: '/', label: 'Ahabanza' },
  { to: '/about', label: 'Ibyerekeye' },
  { to: '/contact', label: 'Twandikire' },
];

function UserAvatar({ user, size = 'sm' }) {
  const dim = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  if (user?.avatar_url) {
    return (
      <img src={user.avatar_url} alt={user.name}
        className={`${dim} rounded-full object-cover ring-2 ring-emerald-300`} />
    );
  }
  return (
    <div className={`${dim} rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-black text-white ring-2 ring-emerald-300`}>
      {initials}
    </div>
  );
}

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

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
    setIsDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener('storage', updateUser);
    return () => window.removeEventListener('storage', updateUser);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
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

  const dropdownItems = [
    { to: '/profile', icon: FaUser, label: 'My Profile' },
    { to: '/cart', icon: FaShoppingBag, label: 'My Cart' },
    { to: '/orders', icon: FaBoxOpen, label: 'My Orders' },
    { to: '/admin', icon: FaUserShield, label: 'Admin Panel' },
  ];

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
            {/* Logo */}
            <Link to="/" className="focus-ring flex min-w-0 items-center gap-3 rounded-full" onClick={closeMenu}>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-950 p-1.5 shadow-lg ring-1 ring-emerald-300/30">
                <img src="/ntuma-logo.png" alt="NTUMA" className="h-full w-full object-contain" />
              </span>
              <span className="hidden sm:block">
                <span className="block text-lg font-black tracking-normal text-slate-950 dark:text-white">NTUMA</span>
                <span className="block text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                  Good food Good mood
                </span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden items-center gap-1 md:flex">
              {publicLinks.map((link) => (
                <Link key={link.to} to={link.to} className={linkClass(link.to)}>
                  {link.label}
                </Link>
              ))}
              {user && (
                <>
                  <Link to="/cart" className={linkClass('/cart')}>Ibyatoranyijwe</Link>
                  <Link to="/orders" className={linkClass('/orders')}>Ibyo natumije</Link>
                </>
              )}
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/10 dark:text-amber-200 dark:hover:text-amber-100"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <FaMoon aria-hidden="true" /> : <FaSun aria-hidden="true" />}
              </button>

              {user ? (
                /* ── Avatar Dropdown ── */
                <div className="relative hidden md:block" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/10 px-3 py-1.5 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-all"
                    aria-label="User menu"
                  >
                    <UserAvatar user={user} size="sm" />
                    <span className="max-w-24 truncate text-sm font-bold text-slate-700 dark:text-slate-100">
                      {user.name ? user.name.split(' ')[0] : 'User'}
                    </span>
                    <FaChevronDown
                      className={`text-xs text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50"
                      >
                        {/* User info header */}
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Signed in as</p>
                          <p className="text-sm font-black text-slate-800 dark:text-white truncate mt-0.5">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>

                        {/* Menu items */}
                        <div className="py-2">
                          {dropdownItems.map(({ to, icon: Icon, label }) => (
                            <Link
                              key={to}
                              to={to}
                              onClick={() => setIsDropdownOpen(false)}
                              className={`flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50
                                ${isActive(to) ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-700 dark:text-slate-200'}`}
                            >
                              <Icon className="w-4 h-4 opacity-70" />
                              {label}
                            </Link>
                          ))}
                        </div>

                        {/* Logout */}
                        <div className="border-t border-slate-100 dark:border-slate-700 py-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <FaSignOutAlt className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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

              {/* Mobile hamburger */}
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

          {/* ── Mobile Menu ── */}
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
                    <Link key={link.to} to={link.to} onClick={closeMenu} className={linkClass(link.to)}>
                      {link.label}
                    </Link>
                  ))}

                  {user && (
                    <>
                      {/* Mobile user info */}
                      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl mb-1">
                        <UserAvatar user={user} size="sm" />
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-800 dark:text-white truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                      </div>

                      <Link to="/profile" onClick={closeMenu} className={linkClass('/profile')}>
                        <span className="inline-flex items-center gap-2"><FaUser /> My Profile</span>
                      </Link>
                      <Link to="/cart" onClick={closeMenu} className={linkClass('/cart')}>Ibyatoranyijwe</Link>
                      <Link to="/orders" onClick={closeMenu} className={linkClass('/orders')}>Ibyo natumije</Link>
                      <Link to="/admin" onClick={closeMenu} className={linkClass('/admin')}>
                        <span className="inline-flex items-center gap-2"><FaUserShield /> Admin</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="focus-ring rounded-full px-4 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50 dark:text-red-200 dark:hover:bg-red-400/10 flex items-center gap-2"
                      >
                        <FaSignOutAlt /> Sign Out
                      </button>
                    </>
                  )}

                  {!user && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <Link to="/login" onClick={closeMenu}
                        className="focus-ring rounded-full border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700 dark:border-white/10 dark:text-slate-100">
                        Injira
                      </Link>
                      <Link to="/signup" onClick={closeMenu}
                        className="focus-ring rounded-full bg-emerald-700 px-4 py-3 text-center text-sm font-black text-white">
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
