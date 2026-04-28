import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderService } from '../services';
import { formatPrice, formatOrderForWhatsApp, generateWhatsAppURL } from '../utils/helpers';

export default function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [locationError, setLocationError] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const orderData = location.state || {
    items: [],
    subtotal: 0,
    delivery: 2.99,
    tax: 0,
    total: 0,
  };

  if (!orderData.items || orderData.items.length === 0) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark mb-4">Nta bintu byo gutumiza</h1>
          <button
            onClick={() => navigate('/cart')}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold"
          >
            Subira mu igare
          </button>
        </div>
      </div>
    );
  }

  // GPS Location Function with FIXED Google Maps Link
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Aho ikoranabuhanga riherereye ntabwo rishyigikiwe na porogaramu yawe yo gushakisha amakuru.');
      return;
    }

    setIsGettingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // FIXED: Generates a proper, clickable Google Maps pin
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setDeliveryLocation(mapsLink);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationError("Ntibyakunze kubona aho uherereye. Gerageza kongera cyangwa andika aderesi yawe mu buryo bw'intoki.");
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handlePlaceOrder = async () => {
    if (!deliveryLocation.trim()) {
      setLocationError('Tanga aho uzageza ibicuruzwa byawe.');
      return;
    }
    setLocationError('');

    try {
      setIsPlacing(true);
      const response = await orderService.createOrder(
        orderData.items,
        orderData.total,
        deliveryLocation 
      );
      setOrderId(response.data.data.id);
    } catch (err) {
      console.error(err);
      alert('Failed to create order');
      setIsPlacing(false);
    }
  };

  const handleOrderViaWhatsApp = () => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '250785032720';
    const message = formatOrderForWhatsApp(
      orderData.items,
      orderData.total,
      orderId,
      deliveryLocation
    );
    const url = generateWhatsAppURL(whatsappNumber, message);
    window.open(url, '_blank');
  };

  if (orderId) {
    return (
      <div className="min-h-screen bg-light py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
              className="text-6xl mb-4"
            >
              ✓
            </motion.div>

            <h1 className="text-3xl font-bold text-dark mb-4">Order Created!</h1>
            <p className="text-gray-600 mb-6">
              Order ID: <span className="font-bold text-primary">#{orderId}</span>
            </p>

            <div className="bg-light p-6 rounded-lg mb-8">
              <h2 className="font-bold text-lg text-dark mb-4">Order Details</h2>
              {orderData.items.map((item) => (
                <div key={item.id} className="flex justify-between mb-2 text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(orderData.total)}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOrderViaWhatsApp}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-lg hover:shadow-lg transition duration-300 mb-4 flex items-center justify-center gap-2"
            >
              <span>📱Gutumiza ukoresheje WhatsApp</span>
            </motion.button>

            <button
              onClick={() => navigate('/')}
              className="w-full border-2 border-primary text-primary font-semibold py-3 rounded-lg hover:bg-light transition duration-300"
            >
              Continue Shopping
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-dark mb-8">Review Your Order</h1>

          {/* Order Items */}
          <div className="space-y-4 mb-8">
            {orderData.items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between items-center p-4 bg-light rounded-lg"
              >
                <div>
                  <h3 className="font-bold text-dark">{item.name}</h3>
                  <p className="text-gray-600 text-sm">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-primary">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-light p-6 rounded-lg mb-8">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(orderData.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{formatPrice(orderData.delivery)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Total</span>
                <span className="text-primary">{formatPrice(orderData.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address Input */}
          <div className="mb-8 p-6 border-2 border-gray-200 rounded-lg">
            <h3 className="font-bold text-dark mb-4">Delivery Details</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Delivery Location *</label>
              
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isGettingLocation}
                className="mb-3 w-full bg-blue-50 text-blue-600 border border-blue-200 font-semibold py-2 px-4 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-2"
              >
                {isGettingLocation ? '⏳ Fetching GPS...' : '📍 Use My Current Location'}
              </button>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  OR
                </div>
                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={(e) => {
                    setDeliveryLocation(e.target.value);
                    if (locationError) setLocationError('');
                  }}
                  placeholder="Type address manually..."
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                    locationError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                  }`}
                />
              </div>
              {locationError && <p className="text-red-500 text-sm mt-2">{locationError}</p>}
            </div>

            <p className="text-gray-600 text-sm">
              We'll share your location and WhatsApp contact with our delivery partner.
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePlaceOrder}
              disabled={isPlacing}
              className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-4 rounded-lg hover:shadow-lg transition duration-300 disabled:opacity-50"
            >
              {isPlacing ? 'Creating Order...' : 'Place Order'}
            </motion.button>

            <button
              onClick={() => navigate('/cart')}
              className="w-full border-2 border-primary text-primary font-semibold py-3 rounded-lg hover:bg-light transition duration-300"
            >
              Back to Cart
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}