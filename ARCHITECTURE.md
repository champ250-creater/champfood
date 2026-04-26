# FoodHub - Architecture & API Documentation

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT BROWSER                           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         React Frontend (Vite)                        │  │
│  │  - Home Page                                         │  │
│  │  - Auth Pages (Login/Signup)                         │  │
│  │  - Food Details                                      │  │
│  │  - Cart Management                                   │  │
│  │  - Order Placement                                   │  │
│  │  - Order History                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER                            │
│                  (Node.js + Express)                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express Server (Port 5000)                          │  │
│  │                                                      │  │
│  │  Routes:                                             │  │
│  │  ├── /api/auth/*                                    │  │
│  │  ├── /api/foods/*                                   │  │
│  │  ├── /api/cart/*                                    │  │
│  │  └── /api/orders/*                                  │  │
│  │                                                      │  │
│  │  Middleware:                                         │  │
│  │  ├── JWT Authentication                             │  │
│  │  ├── Error Handling                                 │  │
│  │  ├── CORS                                           │  │
│  │  └── Security (Helmet)                              │  │
│  │                                                      │  │
│  │  Controllers:                                        │  │
│  │  ├── AuthController                                 │  │
│  │  ├── FoodController                                 │  │
│  │  ├── CartController                                 │  │
│  │  └── OrderController                                │  │
│  │                                                      │  │
│  │  Services:                                           │  │
│  │  ├── AuthService                                    │  │
│  │  ├── FoodService                                    │  │
│  │  ├── CartService                                    │  │
│  │  └── OrderService                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Database Connection
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│                                                              │
│  Tables:                                                     │
│  ├── users                                                   │
│  ├── restaurants                                             │
│  ├── foods                                                   │
│  ├── cart_items                                              │
│  ├── orders                                                  │
│  └── order_items                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ WhatsApp Redirect
                              ▼
                    ┌─────────────────┐
                    │   WhatsApp API  │
                    │ (Pre-filled msg)│
                    └─────────────────┘
```

---

## 🔄 Data Flow

### User Registration Flow
```
1. User fills signup form (name, email, password)
2. Frontend validates input
3. POST /api/auth/signup
4. Backend hashes password (bcrypt)
5. Save to users table
6. Generate JWT token
7. Return token + user data
8. Frontend stores token in localStorage
9. Redirect to home page
```

### Add to Cart Flow
```
1. User clicks "Add to Cart" on food
2. Frontend sends POST /api/cart/add
3. Include quantity & food ID
4. Backend adds/updates cart_items
5. Return updated cart item
6. Frontend shows success message
7. Update local cart count
```

### Place Order Flow
```
1. User reviews cart & clicks "Place Order"
2. Frontend sends POST /api/orders
3. Include cart items & total price
4. Backend creates order record
5. Saves order_items
6. Clears user's cart
7. Returns order ID
8. Frontend displays order success
9. User clicks "Order via WhatsApp"
10. App generates formatted message
11. Opens WhatsApp with pre-filled order details
12. User confirms & sends payment to business
```

---

## 🔐 Authentication System

### JWT Flow

```
Login Request:
{
  email: "user@example.com",
  password: "password123"
}
        ↓
Backend validates credentials
        ↓
Generate JWT Token:
{
  header: { alg: "HS256", typ: "JWT" }
  payload: { userId: 1, email: "user@example.com" }
  signature: HMAC-SHA256(secret)
}
        ↓
Response:
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: { id: 1, email, name }
}
        ↓
Frontend stores in localStorage
        ↓
Every request includes:
Authorization: Bearer {token}
```

### Protected Routes

All cart & order endpoints require:
1. Valid JWT in Authorization header
2. Token not expired (7 days)
3. Signature matches secret

If invalid → 401 Unauthorized

---

## 📡 REST API Endpoints

### Authentication

#### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe"
    }
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe"
    }
  }
}
```

### Foods

#### Get All Foods
```
GET /api/foods

Response (200):
{
  "success": true,
  "message": "Foods retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Margherita Pizza",
      "description": "Classic pizza with tomato, mozzarella, and basil",
      "price": 12.99,
      "image": "https://...",
      "rating": 4.8,
      "restaurantName": "Pizza Palace"
    },
    ...
  ]
}
```

#### Get Food by ID
```
GET /api/foods/:id

Response (200):
{
  "success": true,
  "message": "Food retrieved successfully",
  "data": {
    "id": 1,
    "name": "Margherita Pizza",
    "description": "Classic pizza with tomato, mozzarella, and basil",
    "price": 12.99,
    "image": "https://...",
    "rating": 4.8,
    "restaurantName": "Pizza Palace"
  }
}
```

### Cart (Protected)

#### Add to Cart
```
POST /api/cart/add
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "foodId": 1,
  "quantity": 2
}

Response (201):
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "id": 5,
    "user_id": 1,
    "food_id": 1,
    "quantity": 2
  }
}
```

#### Get Cart
```
GET /api/cart
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": [
    {
      "id": 5,
      "quantity": 2,
      "foodId": 1,
      "name": "Margherita Pizza",
      "price": 12.99,
      "image": "https://...",
      "restaurantName": "Pizza Palace"
    },
    ...
  ]
}
```

#### Update Cart Item
```
PUT /api/cart/:cartItemId
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "quantity": 3
}

Response (200):
{
  "success": true,
  "message": "Cart item updated",
  "data": {
    "id": 5,
    "user_id": 1,
    "food_id": 1,
    "quantity": 3
  }
}
```

#### Remove Item from Cart
```
DELETE /api/cart/:cartItemId
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Item removed from cart"
}
```

#### Clear Cart
```
DELETE /api/cart
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Cart cleared"
}
```

### Orders (Protected)

#### Create Order
```
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "items": [
    {
      "id": 1,
      "name": "Margherita Pizza",
      "quantity": 2,
      "price": 12.99
    }
  ],
  "totalPrice": 31.97
}

Response (201):
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "total_price": 31.97,
    "status": "pending",
    "created_at": "2024-04-24T10:30:00Z"
  }
}
```

#### Get User's Orders
```
GET /api/orders
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "total_price": 31.97,
      "status": "pending",
      "items": [
        {
          "id": 1,
          "name": "Margherita Pizza",
          "quantity": 2,
          "price": 12.99
        }
      ],
      "created_at": "2024-04-24T10:30:00Z"
    }
  ]
}
```

#### Get Order by ID
```
GET /api/orders/:id
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "total_price": 31.97,
    "status": "pending",
    "items": [
      {
        "id": 1,
        "name": "Margherita Pizza",
        "quantity": 2,
        "price": 12.99
      }
    ],
    "created_at": "2024-04-24T10:30:00Z"
  }
}
```

#### Update Order Status
```
PUT /api/orders/:id/status
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "status": "completed"
}

Response (200):
{
  "success": true,
  "message": "Order status updated",
  "data": {
    "id": 1,
    "user_id": 1,
    "total_price": 31.97,
    "status": "completed",
    "updated_at": "2024-04-24T11:00:00Z"
  }
}
```

---

## 🗄️ Database Schema Details

### users
```sql
- id: SERIAL PRIMARY KEY
- email: VARCHAR(255) UNIQUE NOT NULL
- password: VARCHAR(255) NOT NULL (bcrypt hashed)
- name: VARCHAR(255) NOT NULL
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### restaurants
```sql
- id: SERIAL PRIMARY KEY
- name: VARCHAR(255) NOT NULL
- description: TEXT
- image: VARCHAR(255)
- rating: DECIMAL(3, 2)
- delivery_time: INT (minutes)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### foods
```sql
- id: SERIAL PRIMARY KEY
- restaurant_id: INT FOREIGN KEY REFERENCES restaurants(id)
- name: VARCHAR(255) NOT NULL
- description: TEXT
- price: DECIMAL(10, 2) NOT NULL
- image: VARCHAR(255)
- rating: DECIMAL(3, 2)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### cart_items
```sql
- id: SERIAL PRIMARY KEY
- user_id: INT NOT NULL FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE
- food_id: INT NOT NULL FOREIGN KEY REFERENCES foods(id)
- quantity: INT DEFAULT 1
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### orders
```sql
- id: SERIAL PRIMARY KEY
- user_id: INT NOT NULL FOREIGN KEY REFERENCES users(id)
- total_price: DECIMAL(10, 2) NOT NULL
- status: VARCHAR(50) DEFAULT 'pending'
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### order_items
```sql
- id: SERIAL PRIMARY KEY
- order_id: INT NOT NULL FOREIGN KEY REFERENCES orders(id) ON DELETE CASCADE
- food_id: INT NOT NULL FOREIGN KEY REFERENCES foods(id)
- quantity: INT NOT NULL
- price: DECIMAL(10, 2) NOT NULL
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

---

## 🔒 Security Measures

1. **Password Hashing**
   - bcryptjs with 10 salt rounds
   - Never store plain text passwords

2. **JWT Tokens**
   - Signed with secret key
   - 7-day expiration
   - Verified on every protected route

3. **SQL Injection Prevention**
   - Parameterized queries using pg library
   - Never concatenate user input

4. **CORS Protection**
   - Whitelist frontend URL
   - Only allow specific origins

5. **HTTP Headers**
   - Helmet.js for security headers
   - CSP, X-Frame-Options, etc.

6. **Input Validation**
   - Email format validation
   - Password length requirements
   - Quantity > 0 checks

---

## 🎨 Frontend Component Structure

```
App
├── Navbar
│   ├── Logo/Brand
│   ├── Navigation Links
│   ├── Auth Buttons/User Menu
│   └── Mobile Hamburger
├── Main Routes
│   ├── Home
│   │   ├── Hero Section
│   │   ├── Search Bar
│   │   └── Food Grid (FoodCard components)
│   ├── Login
│   ├── Signup
│   ├── FoodDetails
│   ├── Cart
│   │   ├── Cart Items
│   │   └── Order Summary
│   ├── Order
│   │   └── WhatsApp Integration
│   └── Orders (Protected)
├── Footer
└── Error Handler
```

---

## 🚀 Performance Optimizations

1. **Frontend**
   - Code splitting with React Router
   - Image lazy loading
   - CSS minification (Tailwind)
   - Bundle optimization (Vite)

2. **Backend**
   - Database connection pooling
   - Query optimization with indexes
   - Efficient JSON aggregation
   - Request rate limiting ready

3. **Caching**
   - localStorage for auth token
   - Static assets caching
   - Browser caching headers

---

## 📊 Error Handling

### Error Responses

```json
{
  "success": false,
  "message": "Error description",
  "status": 400
}
```

### Status Codes
- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized (invalid token)
- 403: Forbidden (invalid JWT)
- 404: Not Found
- 500: Internal Server Error

---

## 🧪 Testing Scenarios

### Test Case 1: User Registration
```
1. POST /api/auth/signup with valid data
2. Verify user created in database
3. Verify JWT token returned
4. Verify password is hashed
```

### Test Case 2: Add to Cart
```
1. Login and get token
2. POST /api/cart/add with food ID & quantity
3. Verify item in cart_items table
4. Verify quantity if adding same item again
```

### Test Case 3: Place Order
```
1. Add items to cart
2. POST /api/orders with items
3. Verify order created
4. Verify order_items created
5. Verify cart cleared
6. Verify order can be retrieved
```

---

This complete documentation covers the entire FoodHub platform architecture and implementation! 🎉
