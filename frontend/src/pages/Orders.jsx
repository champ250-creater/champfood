import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { orderService } from '../services';
import { formatPrice, formatDate } from '../utils/helpers';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders();
      setOrders(response.data.data || []);
    } catch (err) {
      console.error(err);
      setError('Ntibyakunze kuzana komande zawe');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-light py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-dark mb-8">Komande Zawe</h1>
          <EmptyState
            title="Nta Komande Urakora"
            description="Nta komande n'imwe urakora kugeza ubu. Tangira ureba ibiryo byiza duteka mu isoko ryacu!"
            icon="📦"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-dark mb-8">Komande Zawe</h1>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 text-red-700 p-4 rounded-lg mb-8"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-dark">
                    Komande #{order.id}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {formatDate(order.created_at || order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <span
                    className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {order.status === 'completed' 
                      ? 'YAKOZWE' 
                      : order.status === 'pending' 
                      ? 'ITEGEREJWE' 
                      : order.status?.toUpperCase() || 'ITEGEREJWE'}
                  </span>
                  <span className="font-bold text-lg text-primary">
                    {formatPrice(order.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-light p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-dark mb-3">Ibyo Watumije</h4>
                <div className="space-y-2">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm py-2"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image || 'https://via.placeholder.com/100x100?text=Food'} 
                          alt={item.name} 
                          className="w-12 h-12 object-cover rounded shadow-sm"
                        />
                        <span className="text-gray-600 font-medium">
                          {item.name} x{item.quantity}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-gray-600 text-sm">
                Bizagezwa aho uri binyuze kuri WhatsApp - Reba ubutumwa bwawe ubashe gukurikirana aho bigeze
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}