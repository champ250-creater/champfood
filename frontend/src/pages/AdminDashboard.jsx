import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../services/api';

const CATEGORIES = ['Local Dishes', 'Fast Food', 'Drinks', 'Desserts', 'Breakfast'];

const categoryColors = {
  'Local Dishes': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  'Fast Food':    'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  'Drinks':       'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
  'Desserts':     'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'Breakfast':    'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
};

function Toast({ type, message, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const styles = {
    success: 'bg-emerald-50 border-emerald-400 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    error:   'bg-red-50 border-red-400 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    info:    'bg-blue-50 border-blue-400 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  };
  const icons = { success: '✅', error: '❌', info: '⏳' };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`flex items-center gap-3 px-5 py-3 rounded-xl border shadow-lg text-sm font-semibold ${styles[type]}`}
    >
      <span className="text-lg">{icons[type]}</span>
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-auto opacity-60 hover:opacity-100 transition">✕</button>
    </motion.div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-800 dark:text-white">{value}</p>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [foods, setFoods] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [toasts, setToasts] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '', price: '', category: 'Local Dishes', description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const fetchFoods = async () => {
    try {
      const response = await apiClient.get('/foods');
      if (response.data.success) setFoods(response.data.data);
    } catch (error) {
      console.error('Failed to fetch foods', error);
    }
  };

  useEffect(() => { fetchFoods(); }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileSelect = (file) => {
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFileSelect(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    addToast('info', 'Uploading image and saving...');

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('price', formData.price);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);

      if (imageFile) {
        submitData.append('image', imageFile);
      } else if (editingId && currentImageUrl) {
        submitData.append('image_url', currentImageUrl);
      }

      let response;
      if (editingId) {
        response = await apiClient.put(`/foods/${editingId}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await apiClient.post('/foods/add', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (response.data.success) {
        addToast('success', editingId ? '✏️ Food updated successfully!' : '🍽️ New item added to menu!');
        resetForm();
        fetchFoods();
      } else {
        addToast('error', response.data.message);
      }
    } catch (error) {
      addToast('error', error.response?.data?.message || 'Network error. Could not connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', category: 'Local Dishes', description: '' });
    setImageFile(null);
    setImagePreview('');
    setCurrentImageUrl('');
    setEditingId(null);
  };

  const handleEdit = (food) => {
    setEditingId(food.id);
    setFormData({
      name: food.name,
      price: food.price,
      category: food.category,
      description: food.description,
    });
    setCurrentImageUrl(food.image || food.image_url);
    setImagePreview(food.image || food.image_url);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const response = await apiClient.delete(`/foods/${id}`);
      if (response.data.success) {
        addToast('success', 'Item deleted.');
        fetchFoods();
      }
    } catch (error) {
      addToast('error', 'Failed to delete item.');
    }
  };

  const totalItems = foods.length;
  const categories = [...new Set(foods.map(f => f.category))].length;
  const avgPrice = foods.length
    ? Math.round(foods.reduce((s, f) => s + Number(f.price), 0) / foods.length)
    : 0;

  const allCats = ['All', ...new Set(foods.map(f => f.category))];
  const filtered = foods.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === 'All' || f.category === filterCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
        <AnimatePresence>
          {toasts.map(t => (
            <Toast key={t.id} type={t.type} message={t.message} onDismiss={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-lg">🍽️</div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Admin Dashboard</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm ml-12">Manage your TechBite Kigali menu items</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon="🍽️" label="Total Menu Items" value={totalItems} color="bg-emerald-100 dark:bg-emerald-900/30" />
          <StatCard icon="🏷️" label="Categories" value={categories} color="bg-purple-100 dark:bg-purple-900/30" />
          <StatCard icon="💰" label="Avg. Price (RWF)" value={avgPrice.toLocaleString()} color="bg-amber-100 dark:bg-amber-900/30" />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-8 items-start">

          {/* ===== FORM PANEL ===== */}
          <motion.div
            layout
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden xl:sticky xl:top-4 z-10"
          >
            <div className={`px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between ${editingId ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20'}`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{editingId ? '✏️' : '➕'}</span>
                <h2 className="font-black text-slate-800 dark:text-white">
                  {editingId ? 'Edit Menu Item' : 'Add New Item'}
                </h2>
              </div>
              {editingId && (
                <button onClick={resetForm} className="text-xs font-bold text-slate-500 hover:text-red-500 transition px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                  ✕ Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Food Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Isombe with Ugali"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Price (RWF) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="e.g. 3500"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent/50 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Drag & Drop Image Zone */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Food Image {!editingId && '*'}
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden
                    ${isDragging
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 scale-[1.01]'
                      : 'border-slate-200 dark:border-slate-600 bg-transparent/50 hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'}`}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                        <span className="text-white font-bold text-sm bg-black/50 px-3 py-1.5 rounded-lg">Click to change</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="text-3xl mb-2">📸</div>
                      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                        {isDragging ? 'Drop image here!' : 'Drag & drop or click to upload'}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    required={!editingId}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Describe the dish, ingredients, taste..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent/50 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl font-black text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed
                  ${editingId
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'}`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{editingId ? '💾 Update Item' : '➕ Add to Menu'}</>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* ===== FOOD LIST PANEL ===== */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <h2 className="font-black text-slate-800 dark:text-white mb-0.5">Menu Items</h2>
                <p className="text-xs text-slate-400">{filtered.length} of {totalItems} items</p>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search items..."
                  className="pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent/50 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition w-full sm:w-48"
                />
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-700 flex gap-2 overflow-x-auto">
              {allCats.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    filterCat === cat
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="py-20 text-center">
                <div className="text-5xl mb-4">🍽️</div>
                <p className="text-slate-400 font-semibold">No items found</p>
                <p className="text-slate-400 text-sm mt-1">
                  {search ? `No results for "${search}"` : 'Add your first menu item!'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-transparent/40 text-left">
                      <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Item</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    <AnimatePresence>
                      {filtered.map((food, idx) => (
                        <motion.tr
                          key={food.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: idx * 0.03 }}
                          className={`group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${editingId === food.id ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        >
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img
                                  src={food.image || food.image_url || 'https://via.placeholder.com/56x56?text=Food'}
                                  alt={food.name}
                                  className="w-12 h-12 object-cover rounded-xl shadow-sm ring-2 ring-white dark:ring-slate-700"
                                />
                                {editingId === food.id && (
                                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[9px] text-white font-black">✏</span>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 dark:text-white text-sm leading-tight">{food.name}</p>
                                <p className="text-xs text-slate-400 mt-0.5 max-w-[180px] truncate">{food.description}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${categoryColors[food.category] || 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                              {food.category}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                              {Number(food.price).toLocaleString()} <span className="text-xs font-semibold text-slate-400">RWF</span>
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleEdit(food)}
                                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 font-bold text-xs transition-colors flex items-center gap-1"
                              >
                                ✏️ Edit
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDelete(food.id)}
                                className="px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 font-bold text-xs transition-colors flex items-center gap-1"
                              >
                                🗑️ Delete
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
