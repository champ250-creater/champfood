import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // ✅ Essential for fast navigation

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="bg-dark text-white mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* About Section */}
          <div>
            <h4 className="font-bold mb-4 uppercase">About NZANIRA</h4>
            <p className="text-gray-400 text-sm">
              Your favorite food ordering platform delivering delicious meals to your doorstep in Kigali.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-primary transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary transition">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition">Contact</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {/* ✅ This link now matches the route we added in App.jsx */}
              <li><Link to="/faq" className="hover:text-primary transition">FAQ</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition">Terms</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-gray-400 text-sm underline">aimeishimwe2023@gmail.com</p>
            <p className="text-gray-400 text-sm">Phone: (+250) 785 032 720</p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2026 NZANIRA. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
}