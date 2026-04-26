import pool from '../src/config/database.js';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) => new Promise((resolve) => {
  rl.question(prompt, resolve);
});

const parseNumber = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const showMenu = () => {
  console.log('\n================================');
  console.log('🍽️  FOOD MANAGEMENT SYSTEM');
  console.log('================================');
  console.log('Type the option number and press Enter.');
  console.log('1. View all foods');
  console.log('2. View all restaurants');
  console.log('3. Add new food');
  console.log('4. Update food');
  console.log('5. Delete food');
  console.log('6. Add new restaurant');
  console.log('7. Exit');
  console.log('================================\n');
};

const viewAllFoods = async () => {
  try {
    const result = await pool.query(
      `SELECT f.id, f.name, f.description, f.price, f.image, f.rating, 
              r.name as "restaurantName" FROM foods f 
       LEFT JOIN restaurants r ON f.restaurant_id = r.id 
       ORDER BY f.id`
    );

    if (result.rows.length === 0) {
      console.log('❌ No foods found');
      return;
    }

    console.log('\n📋 ALL FOODS:');
    console.log('─'.repeat(100));
    result.rows.forEach((food) => {
      console.log(`ID: ${food.id} | ${food.name} (${food.restaurantName})`);
      console.log(`   Price: RWF ${food.price} | Rating: ⭐ ${food.rating}`);
      console.log(`   Description: ${food.description}`);
      console.log('─'.repeat(100));
    });
  } catch (error) {
    console.error('❌ Error fetching foods:', error.message);
  }
};

const viewAllRestaurants = async () => {
  try {
    const result = await pool.query('SELECT * FROM restaurants ORDER BY id');

    if (result.rows.length === 0) {
      console.log('❌ No restaurants found');
      return;
    }

    console.log('\n🏪 ALL RESTAURANTS:');
    console.log('─'.repeat(80));
    result.rows.forEach((r) => {
      console.log(`ID: ${r.id} | ${r.name}`);
      console.log(`   Description: ${r.description}`);
      console.log(`   Rating: ⭐ ${r.rating} | Delivery: ${r.delivery_time} min`);
      console.log('─'.repeat(80));
    });
  } catch (error) {
    console.error('❌ Error fetching restaurants:', error.message);
  }
};

const addNewFood = async () => {
  try {
    // First show restaurants
    await viewAllRestaurants();

    const restaurantId = await question('\n👉 Enter restaurant ID: ');
    const name = await question('👉 Enter food name: ');
    const description = await question('👉 Enter food description: ');
    const price = await question('👉 Enter price (RWF): ');
    const image = await question('👉 Enter image URL: ');
    const ratingInput = await question('👉 Enter rating (0-5): ');

    const restaurantIdNum = parseInt(restaurantId, 10);
    const priceNum = parseNumber(price);
    const ratingNum = ratingInput ? parseNumber(ratingInput) : 0;

    if (!restaurantId || Number.isNaN(restaurantIdNum) || !name || priceNum === null) {
      console.log('❌ Missing or invalid fields. Restaurant ID, food name, and price are required.');
      return;
    }

    if (ratingInput && ratingNum === null) {
      console.log('❌ Invalid rating. Please enter a number between 0 and 5.');
      return;
    }

    const result = await pool.query(
      `INSERT INTO foods (restaurant_id, name, description, price, image, rating) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [restaurantIdNum, name, description, priceNum, image, ratingNum || 0]
    );

    console.log('\n✅ Food added successfully!');
    console.log('Added food:', result.rows[0]);
  } catch (error) {
    console.error('❌ Error adding food:', error.message);
  }
};

const updateFood = async () => {
  try {
    // Show all foods
    await viewAllFoods();

    const foodId = await question('\n👉 Enter food ID to update: ');

    // Get current food details
    const foodResult = await pool.query('SELECT * FROM foods WHERE id = $1', [foodId]);
    if (foodResult.rows.length === 0) {
      console.log('❌ Food not found');
      return;
    }

    const currentFood = foodResult.rows[0];
    console.log('\n📝 Current Details:');
    console.log(`   Name: ${currentFood.name}`);
    console.log(`   Description: ${currentFood.description}`);
    console.log(`   Price: RWF ${currentFood.price}`);
    console.log(`   Rating: ⭐ ${currentFood.rating}`);

    const name = await question('\n👉 Enter new name (press Enter to keep current): ') || currentFood.name;
    const description = await question('👉 Enter new description (press Enter to keep current): ') || currentFood.description;
    const priceInput = await question('\n👉 Enter new price (press Enter to keep current): ');
    const ratingInput = await question('👉 Enter new rating (press Enter to keep current): ');

    const priceNum = priceInput === '' ? currentFood.price : parseNumber(priceInput);
    const ratingNum = ratingInput === '' ? currentFood.rating : parseNumber(ratingInput);

    if (priceNum === null) {
      console.log('❌ Invalid price. Please enter a numeric value.');
      return;
    }

    if (ratingInput !== '' && ratingNum === null) {
      console.log('❌ Invalid rating. Please enter a numeric value.');
      return;
    }

    const result = await pool.query(
      `UPDATE foods SET name = $1, description = $2, price = $3, rating = $4 
       WHERE id = $5 RETURNING *`,
      [name, description, priceNum, ratingNum, foodId]
    );

    console.log('\n✅ Food updated successfully!');
    console.log('Updated food:', result.rows[0]);
  } catch (error) {
    console.error('❌ Error updating food:', error.message);
  }
};

const deleteFood = async () => {
  try {
    await viewAllFoods();

    const foodIdInput = await question('\n👉 Enter food ID to delete: ');
    const foodId = parseInt(foodIdInput, 10);

    if (!foodIdInput || Number.isNaN(foodId)) {
      console.log('❌ Invalid food ID. Please enter a valid number.');
      return;
    }

    const confirm = await question('⚠️  Are you sure? Type "yes" to confirm: ');
    if (confirm !== 'yes') {
      console.log('❌ Deletion cancelled');
      return;
    }

    const result = await pool.query('DELETE FROM foods WHERE id = $1 RETURNING *', [foodId]);

    if (result.rows.length === 0) {
      console.log('❌ Food not found');
      return;
    }

    console.log('\n✅ Food deleted successfully!');
    console.log('Deleted food:', result.rows[0].name);
  } catch (error) {
    console.error('❌ Error deleting food:', error.message);
  }
};

const addNewRestaurant = async () => {
  try {
    const name = await question('\n👉 Enter restaurant name: ');
    const description = await question('👉 Enter restaurant description: ');
    const image = await question('👉 Enter image URL: ');
    const ratingInput = await question('👉 Enter rating (0-5): ');
    const deliveryTimeInput = await question('👉 Enter delivery time (minutes): ');

    if (!name) {
      console.log('❌ Restaurant name is required');
      return;
    }

    const ratingNum = ratingInput === '' ? 0 : parseNumber(ratingInput);
    const deliveryTimeNum = deliveryTimeInput === '' ? 30 : parseInt(deliveryTimeInput, 10);

    if (ratingInput !== '' && ratingNum === null) {
      console.log('❌ Invalid rating. Please enter a numeric value.');
      return;
    }

    if (deliveryTimeInput !== '' && Number.isNaN(deliveryTimeNum)) {
      console.log('❌ Invalid delivery time. Please enter a numeric value.');
      return;
    }

    const result = await pool.query(
      `INSERT INTO restaurants (name, description, image, rating, delivery_time) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description, image, ratingNum || 0, deliveryTimeNum]
    );

    console.log('\n✅ Restaurant added successfully!');
    console.log('Added restaurant:', result.rows[0]);
  } catch (error) {
    console.error('❌ Error adding restaurant:', error.message);
  }
};

const main = async () => {
  console.log('\n🚀 Starting Food Management System...\n');

  try {
    // Test connection
    await pool.query('SELECT 1');
    console.log('✅ Database connected successfully!\n');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    rl.close();
    process.exit(1);
  }

  let running = true;
  while (running) {
    showMenu();
    const choice = await question('👉 Enter your choice (1-7): ');

    switch (choice) {
      case '1':
        await viewAllFoods();
        break;
      case '2':
        await viewAllRestaurants();
        break;
      case '3':
        await addNewFood();
        break;
      case '4':
        await updateFood();
        break;
      case '5':
        await deleteFood();
        break;
      case '6':
        await addNewRestaurant();
        break;
      case '7':
        console.log('\n👋 Goodbye!\n');
        running = false;
        break;
      default:
        console.log('❌ Invalid choice. Please try again.');
    }
  }

  rl.close();
  process.exit(0);
};

main().catch((error) => {
  console.error('❌ Unexpected error:', error.message);
  rl.close();
  process.exit(1);
});
