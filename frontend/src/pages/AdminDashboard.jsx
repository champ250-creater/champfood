import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [foods, setFoods] = useState([]);
  const [editingId, setEditingId] = useState(null); // Tracks if we are editing
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Local Dishes',
    image_url: '',
    description: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  // Fetch all foods when the page loads
  const fetchFoods = async () => {
    try {
      // Change to your Render URL if testing live!
      const response = await fetch('http://localhost:5000/api/foods');
      const data = await response.json();
      if (data.success) setFoods(data.data);
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

  // Handle Add OR Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', message: 'Saving...' });

    try {
      const url = editingId 
        ? `http://localhost:5000/api/foods/${editingId}` // PUT URL
        : 'http://localhost:5000/api/foods/add'; // POST URL
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: 'success', message: editingId ? 'Food updated!' : 'Food added successfully!' });
        setFormData({ name: '', price: '', category: 'Local Dishes', image_url: '', description: '' });
        setEditingId(null); // Reset edit mode
        fetchFoods(); // Refresh the list
      } else {
        setStatus({ type: 'error', message: data.message });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Make sure backend is running.' });
    }
  };

  // Handle Edit Button Click
  const handleEdit = (food) => {
    setEditingId(food.id);
    setFormData({
      name: food.name,
      price: food.price,
      category: food.category,
      image_url: food.image_url,
      description: food.description
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll back to form
  };

  // Handle Delete Button Click
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/foods/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        fetchFoods(); // Refresh the list
      }
    } catch (error) {
      console.error("Failed to delete food", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
      <p className="text-slate-600 mb-8">Manage your TechBite Kigali menu here.</p>

      {/* FORM SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-10">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          {editingId ? '✏️ Edit Menu Item' : '➕ Add New Menu Item'}
        </h2>

        {status.message && (
          <div className={`p-4 mb-6 rounded-lg ${status.type === 'success' ? 'bg-green-50 text-green-700' : status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Same inputs you already had */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Food Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Price (RWF)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500">
              <option value="Local Dishes">Local Dishes</option>
              <option value="Fast Food">Fast Food</option>
              <option value="Drinks">Drinks</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Image URL (Ends in .jpg or .png)</label>
            <input type="url" name="image_url" value={formData.image_url} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"></textarea>
          </div>
          
          <div className="flex gap-4">
            <button type="submit" className="flex-1 bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition">
              {editingId ? 'Update Food Item' : 'Save Food Item'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', price: '', category: 'Local Dishes', image_url: '', description: '' }); }} className="bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-lg hover:bg-slate-300 transition">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LIST SECTION */}
      <h2 className="text-xl font-bold text-slate-800 mb-4">📋 Current Menu Items</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {foods.length === 0 ? (
          <p className="p-6 text-slate-500 text-center">No foods added yet.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {foods.map((food) => (
              <li key={food.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <img src={food.image_url} alt={food.name} className="w-16 h-16 object-cover rounded-lg bg-slate-200" />
                  <div>
                    <h3 className="font-bold text-slate-800">{food.name}</h3>
                    <p className="text-sm text-slate-500">{food.category} • {food.price} RWF</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(food)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-semibold text-sm">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(food.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 font-semibold text-sm">
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