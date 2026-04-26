# 🚀 FoodHub - Complete Setup Guide

Follow these steps to get the entire food ordering platform up and running.

## Prerequisites

Before starting, ensure you have:
- ✅ Node.js v14+ installed ([Download](https://nodejs.org))
- ✅ npm or yarn package manager
- ✅ PostgreSQL v12+ installed ([Download](https://www.postgresql.org))
- ✅ Git installed

## Step 1: Database Setup

### 1.1 Create PostgreSQL Database

Open PostgreSQL command line or pgAdmin:

```sql
-- Create database
CREATE DATABASE food_ordering;

-- Verify
\l  -- List all databases
```

### 1.2 Verify Connection

```bash
psql -U postgres -h localhost -d food_ordering
```

If successful, you should see the PostgreSQL prompt.

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd food-ordering-platform/backend
```

### 2.2 Install Dependencies

```bash
npm install
```

Expected packages:
- express
- dotenv
- bcryptjs
- jsonwebtoken
- pg
- cors
- helmet
- nodemon (dev)

### 2.3 Create Environment File

```bash
# Copy example to create .env
cp .env.example .env
```

Edit `.env` file with your settings:

```env
NODE_ENV=development
PORT=5000

# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=food_ordering

# JWT Configuration
JWT_SECRET=super-secret-key-change-this-in-production

# Frontend URL
FRONTEND_URL=http://localhost:5173

# WhatsApp Configuration (your business WhatsApp number)
WHATSAPP_BUSINESS_PHONE=1234567890
```

### 2.4 Setup Database Tables

Run the setup script to create all tables:

```bash
npm run db:setup
```

Expected output:
```
Setting up database tables...
✅ Database tables created successfully!
```

### 2.5 Seed Sample Data

Populate database with sample restaurants and foods:

```bash
npm run db:seed
```

Expected output:
```
Seeding database...
✅ Database seeded successfully!
```

### 2.6 Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# OR production mode
npm start
```

Expected output:
```
🚀 Server running on http://localhost:5000
📝 Environment: development
```

**✅ Backend is ready!**

---

## Step 3: Frontend Setup

### 3.1 Open New Terminal & Navigate to Frontend

```bash
cd food-ordering-platform/frontend
```

### 3.2 Install Dependencies

```bash
npm install
```

Expected packages:
- react
- react-dom
- react-router-dom
- axios
- framer-motion
- tailwindcss
- vite

### 3.3 Create Environment File

```bash
# Copy example to create .env
cp .env.example .env
```

Edit `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_WHATSAPP_NUMBER=1234567890
```

### 3.4 Start Frontend Development Server

```bash
npm run dev
```

Expected output:
```
VITE v4.4.5  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

**✅ Frontend is ready!**

---

## Step 4: Test the Application

### 4.1 Open Browser

Open **http://localhost:5173** in your browser

### 4.2 Create Account

1. Click "Sign Up"
2. Fill in:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
3. Click "Sign Up"

### 4.3 Browse Foods

1. You should see food listing on home page
2. Search for food items
3. Click on a food to see details

### 4.4 Add to Cart

1. Go to food details
2. Select quantity
3. Click "Add to Cart"

### 4.5 Place Order

1. Go to Cart
2. Review order
3. Click "Proceed to Order"
4. Review summary
5. Click "Place Order"
6. Click "Order via WhatsApp"

### 4.6 Test WhatsApp Integration

When you click "Order via WhatsApp", it should:
- Generate a formatted message with order details
- Open WhatsApp Web with pre-filled message
- Ready to send to your business phone number

---

## Common Issues & Solutions

### ❌ "Cannot connect to database"

**Solution:**
```bash
# Verify PostgreSQL is running
# Windows
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start

# macOS
brew services start postgresql

# Linux
sudo service postgresql start

# Test connection
psql -U postgres -h localhost
```

### ❌ "Port 5000 already in use"

**Solution:**
```bash
# Change PORT in backend/.env
PORT=5001

# Then restart backend
npm run dev
```

### ❌ "CORS error in browser console"

**Solution:**
- Check FRONTEND_URL in backend/.env
- Ensure it matches your frontend URL
- Restart backend server

### ❌ "JWT token invalid"

**Solution:**
```bash
# Clear browser localStorage
# 1. Open browser DevTools (F12)
# 2. Go to Application tab
# 3. Clear localStorage
# 4. Log out and log back in
```

### ❌ "npm: command not found"

**Solution:**
- Install Node.js from https://nodejs.org
- Restart terminal after installation

### ❌ Tables already exist

**Solution:**
```bash
# If you get "table already exists" error, drop and recreate
psql -U postgres -d food_ordering -c "DROP TABLE IF EXISTS order_items CASCADE; DROP TABLE IF EXISTS orders CASCADE; DROP TABLE IF EXISTS cart_items CASCADE; DROP TABLE IF EXISTS foods CASCADE; DROP TABLE IF EXISTS restaurants CASCADE; DROP TABLE IF EXISTS users CASCADE;"

# Then run setup again
npm run db:setup
npm run db:seed
```

---

## Project Structure Quick Reference

```
Frontend Tasks:
- Login/Signup ✓
- Browse foods ✓
- Add to cart ✓
- Manage cart ✓
- Place order ✓
- WhatsApp redirect ✓

Backend Tasks:
- Auth endpoints ✓
- Food endpoints ✓
- Cart endpoints ✓
- Order endpoints ✓
- Database ✓
- Error handling ✓
```

---

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- **Frontend:** Changes in `src/` auto-update in browser
- **Backend:** Changes in `src/` auto-restart server

### API Testing

Test APIs using:

```bash
# Using curl (example login)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Browser DevTools

Open DevTools (F12) to:
- Check Network requests
- View Console errors
- Inspect localStorage for tokens
- Monitor performance

---

## Deployment Checklist

Before deploying to production:

- [ ] Change JWT_SECRET in backend/.env
- [ ] Set NODE_ENV=production
- [ ] Update FRONTEND_URL to production URL
- [ ] Configure real WhatsApp Business number
- [ ] Test all payment flows
- [ ] Set up proper error logging
- [ ] Enable HTTPS
- [ ] Add production database credentials
- [ ] Run security audit: `npm audit`
- [ ] Build frontend: `npm run build`

---

## Next Steps

✅ **Setup Complete!** You now have:
- Running backend API on port 5000
- Running frontend app on port 5173
- PostgreSQL database with sample data
- Full authentication system
- Working cart and order system
- WhatsApp integration ready

### What You Can Do Now:

1. **Customize Food Items** - Add/edit foods in database
2. **Add More Features** - Reviews, ratings, delivery tracking
3. **Deploy** - Push to production servers
4. **Integrate Real Payment** - Add Stripe/PayPal instead of WhatsApp
5. **Admin Dashboard** - Create admin panel for restaurants

---

## Support & Help

For questions or issues:
1. Check error messages carefully
2. Review console logs
3. Check database connection
4. Verify .env files are correct
5. Restart servers if needed

**Happy Coding! 🎉**
