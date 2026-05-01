import { useState } from 'react';
import { motion } from 'framer-motion';

// UPDATE THIS IF TESTING LOCALLY, BUT KEEP RENDER FOR LIVE
const API_URL = 'https://champfood.onrender.com/api/foods';

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Local Dishes', // Default category
    image_url: ''
  });
  
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Habaye ikibazo (Error saving food)');
      }

      setStatus('success');
      setMessage(data.message);
      
      // Clear form after success
      setFormData({
        name: '', description: '', price: '', category: 'Local Dishes', image_url: ''
      });

      // Clear the success message after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);

    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500">Manage your TechBite Kigali menu here.</p>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white border-b pb-4">Add New Menu Item</h2>

          {status === 'success' && (
            <div className="mb-6 p-4 bg-teal-50 text-teal-700 rounded-xl border border-teal-200">
              ✅ {message}
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
              ❌ {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Food Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., Akabenz, Chapati & Beans..." />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Price (RWF)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., 2500" />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 bg-white">
                <option value="Local Dishes">Local Dishes</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Drinks">Drinks</option>
                <option value="Desserts">Desserts</option>
              </select>
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Image URL</label>
              <input type="url" name="image_url" value={formData.image_url} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                placeholder="https://example.com/image.jpg" />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                placeholder="Describe the meal..." />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 pt-4">
              <button type="submit" disabled={status === 'loading'}
                className="w-full bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all">
                {status === 'loading' ? 'Saving...' : 'Save Food Item'}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
}