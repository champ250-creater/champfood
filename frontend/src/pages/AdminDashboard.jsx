import { useState, useEffect } from 'react';
import apiClient from '../services/api';

export default function AdminDashboard() {
  const [foods, setFoods] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Local Dishes',
    description: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  const [status, setStatus] = useState({ type: '', message: '' });

  const fetchFoods = async () => {
    try {
      const response = await apiClient.get('/foods');
      if (response.data.success) {
        setFoods(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch foods", error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', message: 'Uploading image and saving... please wait.' });

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
        setStatus({ 
          type: 'success', 
          message: editingId ? 'Food updated successfully!' : 'Food added successfully!' 
        });
        
        setFormData({ name: '', price: '', category: 'Local Dishes', description: '' });
        setImageFile(null);
        setCurrentImageUrl('');
        setEditingId(null); 
        document.getElementById('imageInput').value = ''; 
        
        fetchFoods(); 
      } else {
        setStatus({ type: 'error', message: response.data.message });
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Network error. Could not connect to server.' });
    }
  };

  const handleEdit = (food) => {
    setEditingId(food.id);
    setFormData({
      name: food.name,
      price: food.price,
      category: food.category,
      description: food.description
    });
    setCurrentImageUrl(food.image || food.image_url); 
    setImageFile(null); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await apiClient.delete(`/foods/${id}`);
      if (response.data.success) {
        fetchFoods(); 
      }
    } catch (error) {
      console.error("Failed to delete food", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Admin Dashboard</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-8">Manage your NTUMA menu here.</p>

      {/* FORM SECTION */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-10">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
          {editingId ? '✏️ Edit Menu Item' : '➕ Add New Menu Item'}
        </h2>

        {status.message && (
          <div className={`p-4 mb-6 rounded-lg font-semibold ${status.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : status.type === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Food Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Price (RWF)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-slate-900 dark:border-slate-600 dark:text-white">
              <option value="Local Dishes">Local Dishes</option>
              <option value="Fast Food">Fast Food</option>
              <option value="Drinks">Drinks</option>
            </select>
          </div>
          
          <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900/50">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Upload Image</label>
            {editingId && currentImageUrl && (
              <div className="mb-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Current Image:</p>
                <img src={currentImageUrl} alt="Current" className="w-20 h-20 object-cover rounded-md" />
              </div>
            )}
            <input 
              type="file" 
              id="imageInput"
              accept="image/*" 
              onChange={handleFileChange} 
              required={!editingId} 
              className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-900/30 dark:file:text-emerald-400" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-slate-900 dark:border-slate-600 dark:text-white"></textarea>
          </div>
          
          <div className="flex gap-4">
            <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition">
              {editingId ? 'Update Food Item' : 'Save Food Item'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { 
                setEditingId(null); 
                setFormData({ name: '', price: '', category: 'Local Dishes', description: '' }); 
                setImageFile(null);
                setCurrentImageUrl('');
                document.getElementById('imageInput').value = '';
              }} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LIST SECTION */}
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">📋 Current Menu Items</h2>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {foods.length === 0 ? (
          <p className="p-6 text-slate-500 dark:text-slate-400 text-center">No foods added yet.</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {foods.map((food) => (
              <li key={food.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 gap-4">
                <div className="flex items-center gap-4">
                  <img src={food.image || food.image_url} alt={food.name} className="w-16 h-16 object-cover rounded-lg bg-slate-200 dark:bg-slate-700" />
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">{food.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{food.category} • {food.price} RWF</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(food)} className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 font-semibold text-sm transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(food.id)} className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 font-semibold text-sm transition-colors">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}