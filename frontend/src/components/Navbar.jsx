import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getStoredUser, clearAuth } from '../utils/helpers';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // This function syncs the user state with local storage
  const updateUser = () => {
    const storedUser = getStoredUser();
    setUser(storedUser);
  };

  useEffect(() => {
    updateUser();
    
    // Listen for storage changes (handles login/logout in other tabs)
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
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Branding */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-gray-800">
              CHAMP<span className="text-red-500">FOOD</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 font-medium hover:text-orange-500 transition-colors">
              Home
            </Link>
            {user && (
              <>
                <Link to="/cart" className="text-gray-600 font-medium hover:text-orange-500 transition-colors">
                  Cart
                </Link>
                <Link to="/orders" className="text-gray-600 font-medium hover:text-orange-500 transition-colors">
                  My Orders
                </Link>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 sm:gap-6">
                {/* User Profile Badge */}
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full shadow-sm">
                  <div className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold uppercase ring-2 ring-white">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-gray-700 hidden sm:inline">
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 border border-transparent hover:border-red-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-gray-700 font-semibold px-4 py-2 hover:text-orange-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-orange-500 text-white px-5 py-2 rounded-lg font-bold shadow-md hover:bg-orange-600 transition-all hover:scale-105 active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-gray-100 py-4 space-y-2"
          >
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium rounded-lg"
            >
              Home
            </Link>
            {user && (
              <>
                <Link 
                  to="/cart" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium rounded-lg"
                >
                  Cart
                </Link>
                <Link 
                  to="/orders" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium rounded-lg"
                >
                  My Orders
                </Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}