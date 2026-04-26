# 🚀 FoodHub - Quick Reference Guide

## 📍 Getting Started

### In 3 Steps:

**Step 1: Backend Setup (Terminal 1)**
```bash
cd food-ordering-platform/backend
npm install
npm run db:setup
npm run db:seed
npm run dev
```

**Step 2: Frontend Setup (Terminal 2)**
```bash
cd food-ordering-platform/frontend
npm install
npm run dev
```

**Step 3: Open Browser**
```
http://localhost:5173
```

---

## 🔑 Test Credentials

Use these to test signup/login:

```
Email: test@example.com
Password: password123
Name: Test User
```

Or create your own account!

---

## 📱 WhatsApp Integration

### How it Works:

1. **Add items to cart** → Browse & select foods
2. **Go to cart** → Review items & quantities
3. **Checkout** → Click "Proceed to Order"
4. **Review** → Check order summary
5. **WhatsApp** → Click "Order via WhatsApp"
6. **Pre-filled message** → Opens with order details
7. **Send** → User sends to business number

### Message Format:
```
*FoodHub Order #123*

*Order Details:*
• Pizza x2 - $25.98
• Burger x1 - $10.99

*Total: $39.97*

Thank you for your order!
```

---

## 🛠️ Common Commands

### Backend Commands
```bash
npm run dev          # Start dev server (auto-reload)
npm run db:setup    # Create all tables
npm run db:seed     # Add sample restaurants/foods
npm start           # Production start
```

### Frontend Commands
```bash
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

---

## 📡 API Quick Reference

### No Auth Required:
```
GET  /api/foods              # Get all foods
GET  /api/foods/:id          # Get food details
POST /api/auth/signup        # Create account
POST /api/auth/login         # Login
```

### Requires Auth Token:
```
POST   /api/cart/add         # Add to cart
GET    /api/cart             # Get cart
PUT    /api/cart/:id         # Update quantity
DELETE /api/cart/:id         # Remove item
DELETE /api/cart             # Clear cart

POST   /api/orders           # Create order
GET    /api/orders           # Get user's orders
GET    /api/orders/:id       # Get order details
```

---

## 🔐 Authentication

### Token Storage:
```javascript
// Token saved in localStorage after login
localStorage.getItem('token')      // JWT token
localStorage.getItem('user')       // User data (JSON)
```

### Using Token:
```javascript
// Automatically added to all requests by axios interceptor
// Header: Authorization: Bearer {token}
```

### Logout:
```javascript
// Clear auth from frontend
localStorage.removeItem('token')
localStorage.removeItem('user')
// Redirect to /login
```

---

## 📁 File Locations

### Frontend Important Files:
```
frontend/
├── src/pages/           # All pages
├── src/components/      # Reusable components
├── src/services/        # API calls
├── src/utils/           # Helper functions
├── src/App.jsx          # Routes definition
├── src/index.css        # Global styles
├── index.html           # HTML entry
└── .env                 # Config variables
```

### Backend Important Files:
```
backend/
├── src/controllers/     # API logic
├── src/routes/          # Route definitions
├── src/services/        # Business logic
├── src/middleware/      # Auth & errors
├── src/config/          # DB & JWT
├── src/server.js        # Express app
├── db/setup.js          # Table creation
├── db/seed.js           # Sample data
└── .env                 # Config variables
```

---

## 🐛 Troubleshooting Quick Fixes

### Backend won't start?
```bash
# Check if port 5000 is free
# Or change PORT in .env
# Then restart: npm run dev
```

### Database connection error?
```bash
# Make sure PostgreSQL is running
# Check credentials in .env
# Verify database exists
```

### Frontend shows 404 for API?
```bash
# Check VITE_API_URL in .env
# Make sure backend is running
# Check browser console for errors
```

### "Token expired" error?
```bash
# Clear localStorage
# Log out and log back in
# Token will be refreshed
```

### Can't add to cart?
```bash
# Make sure you're logged in
# Check browser console
# Verify backend is running
```

---

## 💡 Useful Tips

### Adding More Foods:
```sql
-- Connect to PostgreSQL
psql -U postgres -d food_ordering

-- Add food
INSERT INTO foods (restaurant_id, name, description, price, image, rating)
VALUES (1, 'New Food', 'Description', 19.99, 'image-url', 4.5);
```

### Changing WhatsApp Number:
```env
# In backend/.env
WHATSAPP_BUSINESS_PHONE=1234567890

# In frontend/.env
VITE_WHATSAPP_NUMBER=1234567890
```

### Testing Different States:

```javascript
// Add to Home page to test loading:
// Change: const [loading, setLoading] = useState(true);

// Add to Cart page to test empty:
// Clear all items from cart

// Add to Orders to test history:
// Place multiple test orders
```

---

## 📊 Default Sample Data

### Restaurants:
1. Pizza Palace → pizzas & pasta
2. Burger Barn → burgers & fries
3. Sushi Dreams → sushi & rolls
4. Taco Fiesta → tacos & quesadillas
5. Curry House → Indian curries

### Prices Range:
- Cheapest: $4.99 (Fries)
- Most Expensive: $14.99 (Butter Chicken, Pepperoni Pizza)
- Average: ~$12.00

---

## 🔄 Data Flow Overview

```
1. USER SIGNS UP
   ↓
2. JWT TOKEN GENERATED
   ↓
3. BROWSE FOODS
   ↓
4. ADD TO CART
   ↓
5. REVIEW CART
   ↓
6. PLACE ORDER
   ↓
7. ORDER CREATED IN DB
   ↓
8. WHATSAPP REDIRECT
   ↓
9. USER SENDS PAYMENT MSG
   ↓
10. ORDER MARKED PENDING
```

---

## 🎨 Styling & Customization

### Color Scheme:
```css
--primary:   #FF6B35  (Orange)
--secondary: #004E89  (Blue)
--accent:    #F7931E  (Gold)
--light:     #F5F5F5  (Light Gray)
--dark:      #1A1A1A  (Dark Gray)
```

### Change Colors:
Edit `frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#YOUR_COLOR',
      // ... other colors
    }
  }
}
```

---

## 📈 Performance Tips

### Frontend:
- Use Production Build: `npm run build`
- Enable caching in servers
- Optimize images
- Lazy load components

### Backend:
- Use connection pooling (already configured)
- Add database indexes
- Cache frequently accessed data
- Monitor query performance

---

## 🚀 Deployment Checklist

- [ ] Change JWT_SECRET in backend/.env
- [ ] Set NODE_ENV=production
- [ ] Build frontend: `npm run build`
- [ ] Test all APIs
- [ ] Configure production database
- [ ] Set real WhatsApp number
- [ ] Update FRONTEND_URL for CORS
- [ ] Enable HTTPS
- [ ] Set up error logging
- [ ] Test payment flow
- [ ] Deploy backend first
- [ ] Deploy frontend second

---

## 📚 File Locations for Key Features

### Authentication:
- `backend/src/services/authService.js` - Signup/login logic
- `backend/src/controllers/authController.js` - API handlers
- `frontend/src/pages/Login.jsx` - Login page
- `frontend/src/pages/Signup.jsx` - Signup page

### Food Display:
- `backend/src/services/foodService.js` - Fetch foods
- `frontend/src/pages/Home.jsx` - Food listing
- `frontend/src/components/FoodCard.jsx` - Food card UI
- `frontend/src/pages/FoodDetails.jsx` - Detail page

### Shopping Cart:
- `backend/src/services/cartService.js` - Cart logic
- `backend/src/controllers/cartController.js` - Cart API
- `frontend/src/pages/Cart.jsx` - Cart page UI

### Orders & WhatsApp:
- `backend/src/services/orderService.js` - Order logic
- `frontend/src/pages/Order.jsx` - Order review
- `frontend/src/utils/helpers.js` - WhatsApp formatter

---

## 🔗 Quick Links

| Resource | Location |
|----------|----------|
| Main Docs | README.md |
| Setup Steps | SETUP.md |
| Architecture | ARCHITECTURE.md |
| This Guide | QUICK_REFERENCE.md |
| Summary | DELIVERY_SUMMARY.md |

---

## ❓ FAQ

**Q: How do I add more foods?**
A: Edit PostgreSQL directly or add via SQL INSERT commands

**Q: Can I change the color scheme?**
A: Yes, edit `frontend/tailwind.config.js`

**Q: How do I connect a real payment gateway?**
A: Replace WhatsApp logic in `Order.jsx` with Stripe/PayPal SDK

**Q: Can I run on different ports?**
A: Yes, change `PORT` in backend/.env and frontend config

**Q: How do I backup the database?**
A: Use `pg_dump` command for PostgreSQL

**Q: Can I deploy to the cloud?**
A: Yes, see Deployment Checklist section

---

## 📞 Emergency Contacts/Resources

### If Backend Won't Start:
1. Check Node.js installed: `node -v`
2. Check npm installed: `npm -v`
3. Reinstall deps: `rm -rf node_modules && npm install`
4. Check logs in terminal

### If Frontend Won't Start:
1. Check port 5173 free
2. Clear .vite cache: `rm -rf .vite`
3. Reinstall deps: `rm -rf node_modules && npm install`
4. Check browser console

### If Database Won't Connect:
1. Start PostgreSQL service
2. Verify credentials in .env
3. Create database: `createdb food_ordering`
4. Run setup: `npm run db:setup`

---

## ✨ Quick Wins to Impress!

Try these to show off the app:

1. **Fast Search** - Type in search bar, see instant results
2. **Smooth Animations** - Watch page transitions & hover effects
3. **Responsive Design** - Resize browser to see mobile layout
4. **WhatsApp** - Complete order flow with WhatsApp redirect
5. **Order History** - Place multiple orders, see them tracked

---

## 🎉 You're All Set!

Everything is ready to:
- ✅ Run locally
- ✅ Test features
- ✅ Modify code
- ✅ Deploy to production
- ✅ Show to clients/investors

**Happy coding! 🚀**

---

Last updated: April 24, 2026
Version: 1.0.0
Status: ✅ Production Ready
