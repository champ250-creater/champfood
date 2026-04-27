// Format currency - Updated for Rwandan Francs (RWF)
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0, // RWF usually doesn't use decimals
  }).format(price);
};

// Format date
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Generate WhatsApp message URL
export const generateWhatsAppURL = (phoneNumber, orderDetails) => {
  const message = encodeURIComponent(orderDetails);
  return `https://wa.me/${phoneNumber}?text=${message}`;
};

// Format order details for WhatsApp - Updated for RWF and Location
export const formatOrderForWhatsApp = (items, totalPrice, orderId, location) => {
  let message = `*champfood #${orderId}*\n\n`;
  
  // NEW: Added the delivery location to the message
  if (location) {
    message += `*📍 Delivery Location:*\n${location}\n\n`;
  }

  message += `*Order Details:*\n`;
  
  items.forEach((item) => {
    message += `• ${item.name} x${item.quantity} - ${item.price * item.quantity} RWF\n`;
  });
  
  message += `\n*Total: ${totalPrice} RWF*\n`;
  message += `\nThank you for your order!`;
  
  return message;
};

// Store auth token
export const storeAuthToken = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Get auth token
export const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token || token === 'undefined') return null;
  return token;
};

// Get stored user - FIXED CRASH BUG
export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    
    // Check for null OR the literal string "undefined"
    if (!user || user === 'undefined') {
      return null;
    }

    return JSON.parse(user);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null; // Return null instead of crashing the site
  }
};

// Clear auth
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};