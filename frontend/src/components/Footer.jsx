import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="bg-dark text-white mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">About FoodHub</h4>
            <p className="text-gray-400 text-sm">
              Your favorite food ordering platform delivering delicious meals to your doorstep.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-primary transition">Home</a></li>
              <li><a href="#" className="hover:text-primary transition">About</a></li>
              <li><a href="#" className="hover:text-primary transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-primary transition">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-gray-400 text-sm">Email: byishimovedaste@gmail.com</p>
            <p className="text-gray-400 text-sm">Phone: (+250) 798 880 004</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2025 champfood. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
}
