# 🍽️ Food Management Guide

This guide shows you how to add, update, and delete foods in your database.

## Option 1: Interactive Food Manager (Recommended)

### Run the Manager

```bash
# First, open a terminal in the backend directory
cd backend

# Then run the manager
npm run manage:foods
```

This launches an interactive menu where you can:
- ✅ View all foods
- ✅ View all restaurants  
- ✅ Add new food items
- ✅ Update existing foods
- ✅ Delete foods
- ✅ Add new restaurants

### Example: Adding a Food

```
1. Select option 3 (Add new food)
2. Enter restaurant ID (see option 2 to view restaurants first)
3. Enter food name: "Chicken Brochette"
4. Enter description: "Grilled chicken skewers with vegetables"
5. Enter price: 3500
6. Enter image URL: "https://images.unsplash.com/photo-..."
7. Enter rating: 4.8
```

---

## Option 2: Direct SQL Commands

Connect to your database and run these commands:

### View Current Foods
-- See all foods
SELECT f.id, f.name, f.description, f.price, f.rating, 
       r.name as restaurant 
FROM foods f 
LEFT JOIN restaurants r ON f.restaurant_id = r.id;

-- See all restaurants
SELECT * FROM restaurants;
```

### Add a Single Food

```sql
-- First, get restaurant ID
SELECT id, name FROM restaurants;

-- Then add food (replace RESTAURANT_ID with actual ID)
INSERT INTO foods (restaurant_id, name, description, price, image, rating) 
VALUES (1, 'Chicken Brochette', 'Grilled chicken skewers', 3500, 'https://...', 4.8);
```

### Add Multiple Foods at Once

```sql
-- Add several foods from same restaurant
INSERT INTO foods (restaurant_id, name, description, price, image, rating) VALUES
(1, 'Chicken Brochette', 'Grilled chicken skewers', 3500, 'https://...', 4.8),
(1, 'Fish Brochette', 'Fresh grilled fish', 4200, 'https://...', 4.7),
(1, 'Vegetable Brochette', 'Grilled vegetables', 2500, 'https://...', 4.5);
```

### Update a Food Item

```sql
-- Update price or details
UPDATE foods 
SET name = 'Premium Chicken Brochette', price = 4000, rating = 4.9 
WHERE id = 1;
```

### Delete a Food

```sql
-- Delete a food item
DELETE FROM foods WHERE id = 1;
```

### Add a New Restaurant

```sql
INSERT INTO restaurants (name, description, image, rating, delivery_time) 
VALUES ('Restaurant Name', 'Description', 'https://...', 4.8, 25);
```

---

## Option 3: Bulk Add Foods (Script)

Create a new file `backend/db/bulkAddFoods.js`:

```javascript
import pool from '../src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const foods = [
  {
    restaurantId: 1,
    name: 'Chicken Fillet',
    description: 'Crispy chicken fillet with fries',
    price: 3800,
    image: 'https://images.unsplash.com/photo-...',
    rating: 4.6
  },
  {
    restaurantId: 2,
    name: 'Lamb Kofte',
    description: 'Turkish style lamb meatballs',
    price: 4500,
    image: 'https://images.unsplash.com/photo-...',
    rating: 4.8
  },
  // Add more foods here
];

const bulkAddFoods = async () => {
  try {
    for (const food of foods) {
      await pool.query(
        `INSERT INTO foods (restaurant_id, name, description, price, image, rating) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [food.restaurantId, food.name, food.description, food.price, food.image, food.rating]
      );
      console.log(`✅ Added: ${food.name}`);
    }
    console.log('\n✅ All foods added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

bulkAddFoods();
```

Then run:
```bash
node db/bulkAddFoods.js
```

---

## Food Data Fields

| Field | Type | Required | Example |
|-------|------|----------|---------|
| `restaurant_id` | Integer | ✅ Yes | 1 |
| `name` | Text | ✅ Yes | "Chicken Brochette" |
| `description` | Text | Optional | "Grilled chicken skewers" |
| `price` | Decimal | ✅ Yes | 3500 |
| `image` | URL | Optional | "https://images.unsplash.com/..." |
| `rating` | Decimal (0-5) | Optional | 4.8 |

---

## Image URL Suggestions

Get free food images from:
- 🖼️ [Unsplash](https://unsplash.com/nQuery=food) - Food images
- 🖼️ [Pexels](https://www.pexels.com/search/food/) - Free stock photos
- 🖼️ [Pixabay](https://pixabay.com/search/food/) - Royalty-free images

---

## Common Examples

### Rwandan Food Specialties

```javascript
{
  restaurantId: 1,
  name: 'Matoke',
  description: 'Steamed plantains with peas - traditional Rwandan dish',
  price: 3200,
  image: 'https://images.unsplash.com/photo-...',
  rating: 4.7
}
```

### International Foods

```javascript
{
  restaurantId: 2,
  name: 'Biryani',
  description: 'Fragrant Indian rice with spiced meat',
  price: 5000,
  image: 'https://images.unsplash.com/photo-...',
  rating: 4.9
}
```

---

## Troubleshooting

### ❌ "Restaurant ID not found"
- First check available restaurants: `SELECT id, name FROM restaurants;`
- Use an existing restaurant ID

### ❌ "Price must be a number"
- Ensure price is numeric: `3500` not `"3500"`

### ❌ "Duplicate entry"
- Food name must be unique OR use UPDATE instead of INSERT

### ❌ Database connection error
- Ensure PostgreSQL is running
- Check `.env` credentials are correct

---

## Tips

💡 **Pro Tips:**
- Always view restaurants first (Option 2) before adding foods
- Use descriptive food names and descriptions for better UX
- Add ratings based on customer feedback (0-5 scale)
- Use high-quality food images for better visual appeal
- Group foods by restaurant for organized menu

🚀 **Next Steps:**
- Add customer reviews system
- Create admin dashboard to manage foods
- Implement food categories/filters
- Add seasonal specials
