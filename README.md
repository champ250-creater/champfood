# FoodHub - Food Ordering Platform

A modern, full-stack food ordering web application with WhatsApp payment integration.

## 🎯 Features

✨ **Frontend:**
- Modern React UI with Vite
- Tailwind CSS styling with smooth animations (Framer Motion)
- Responsive design (mobile + desktop)
- User authentication (Sign up / Login)
- Browse food items with search
- Add to cart functionality
- Cart management
- Order placement with WhatsApp integration

✨ **Backend:**
- Node.js + Express RESTful API
- PostgreSQL database with proper schema
- JWT authentication
- Password hashing with bcrypt
- Parameterized queries for security
- Error handling middleware
- Structured MVC architecture

✨ **Database:**
- Users table
- Restaurants table
- Foods table
- Cart items table
- Orders & Order items tables
- Foreign key relationships

## 📋 Prerequisites

- Node.js (v14+)
- npm or yarn
- PostgreSQL (v12+)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
cd food-ordering-platform
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your PostgreSQL credentials
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=food_ordering

# Setup database tables
npm run db:setup

# Seed sample data
npm run db:seed

# Start server (development)
npm run dev

# OR for production
npm start
```

**Server will run on: http://localhost:5000**

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your WhatsApp number
# VITE_WHATSAPP_NUMBER=1234567890
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev

# OR build for production
npm run build
```

**Frontend will run on: http://localhost:5173**

## 📁 Project Structure

```
food-ordering-platform/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── FoodCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── FoodDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Order.jsx
│   │   │   └── Orders.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── index.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── foodController.js
│   │   │   ├── cartController.js
│   │   │   └── orderController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── foodRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   └── orderRoutes.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── foodService.js
│   │   │   ├── cartService.js
│   │   │   └── orderService.js
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── jwt.js
│   │   └── server.js
│   ├── db/
│   │   ├── setup.js
│   │   └── seed.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Foods
- `GET /api/foods` - Get all foods
- `GET /api/foods/:id` - Get food by ID

### Cart (Protected)
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart` - Get user's cart
- `PUT /api/cart/:cartItemId` - Update cart item quantity
- `DELETE /api/cart/:cartItemId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Orders (Protected)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status

## 🔐 Authentication Flow

1. User signs up/logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. All requests include token in Authorization header
5. Protected routes verified by auth middleware

## 💳 WhatsApp Payment Flow

1. User adds items to cart
2. Reviews order summary
3. Clicks "Order via WhatsApp"
4. App generates formatted order message
5. WhatsApp opens with pre-filled message
6. User confirms payment details with business
7. Order is marked as pending on database

**WhatsApp URL Format:**
```
https://wa.me/{PHONE_NUMBER}?text={ENCODED_MESSAGE}
```

## 🗄️ Database Schema

### Users
```sql
- id (PRIMARY KEY)
- email (UNIQUE)
- password (hashed)
- name
- created_at
- updated_at
```

### Foods
```sql
- id (PRIMARY KEY)
- restaurant_id (FOREIGN KEY)
- name
- description
- price
- image
- rating
- created_at
```

### Cart Items
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- food_id (FOREIGN KEY)
- quantity
- created_at
```

### Orders
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- total_price
- status (pending/completed/cancelled)
- created_at
- updated_at
```

## 🎨 UI/UX Highlights

- Smooth animations with Framer Motion
- Gradient backgrounds and modern design
- Card-based layouts
- Loading states
- Empty states with helpful messages
- Hover effects and smooth transitions
- Mobile-responsive design
- Sticky navigation bar
- Beautiful color scheme (Primary: #FF6B35, Accent: #F7931E)

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Parameterized SQL queries (SQL injection prevention)
- CORS enabled
- Helmet.js for security headers
- Protected routes
- Environment variables for sensitive data

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway/Render)
```bash
# Set environment variables
# Deploy
```

## 📝 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=food_ordering
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
WHATSAPP_BUSINESS_PHONE=1234567890
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_WHATSAPP_NUMBER=1234567890
```

## 🐛 Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check credentials in .env
- Verify database name exists

### CORS Error
- Check FRONTEND_URL in backend .env
- Ensure both servers are running

### Auth Token Issues
- Clear localStorage
- Log out and log back in
- Check JWT_SECRET matches

## 📚 Technologies Used

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Axios, React Router
- **Backend:** Node.js, Express, PostgreSQL, JWT, bcryptjs
- **Tools:** npm, nodemon, dotenv

## 📧 Support

For issues or questions, please create an issue or contact the development team.

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ for food lovers!**
