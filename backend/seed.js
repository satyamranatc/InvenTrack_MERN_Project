const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');
const AuditLog = require('./models/AuditLog');
const User = require('./models/User');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const categories = [
  { name: 'Electronics' },
  { name: 'Fashion' },
  { name: 'Home & Kitchen' },
  { name: 'Beauty & Personal Care' },
  { name: 'Books' }
];

const products = [
  { 
    name: 'MacBook Pro 16"', 
    category: 'Electronics', 
    stock: 5, // LOW STOCK
    unit: 'Pieces', 
    price: 2499, 
    description: 'Apple M3 Pro chip, 16GB RAM, 512GB SSD',
    minStockThreshold: 10,
    batchNumber: 'BT-APL-2024',
    location: 'Zone A-1'
  },
  { 
    name: 'iPhone 15 Pro', 
    category: 'Electronics', 
    stock: 45, 
    unit: 'Pieces', 
    price: 999, 
    description: 'Titanium design, A17 Pro chip',
    minStockThreshold: 15,
    batchNumber: 'BT-APL-2023',
    location: 'Zone A-2'
  },
  { 
    name: 'Dyson V15 Detect', 
    category: 'Home & Kitchen', 
    stock: 3, // VERY LOW
    unit: 'Pieces', 
    price: 749, 
    description: 'Most powerful, intelligent cordless vacuum',
    minStockThreshold: 8,
    batchNumber: 'BT-DYS-99',
    location: 'Zone H-4'
  },
  { 
    name: 'Organic Milk 1L', 
    category: 'Home & Kitchen', 
    stock: 50, 
    unit: 'Cartons', 
    price: 4.5, 
    description: 'Fresh organic whole milk',
    minStockThreshold: 20,
    batchNumber: 'BT-DAIRY-01',
    expiryDate: new Date('2024-01-01'), // EXPIRED
    location: 'Cold Storage 1'
  },
  { 
    name: 'Nike Air Max 270', 
    category: 'Fashion', 
    stock: 120, 
    unit: 'Pairs', 
    price: 150, 
    description: 'Lifestyle shoe with large Air unit',
    minStockThreshold: 25,
    batchNumber: 'BT-NIKE-270',
    location: 'Zone F-2'
  }
];

const customers = ['John Doe', 'Alice Smith', 'Bob Johnson', 'Emma Wilson', 'Michael Brown', 'Sophia Garcia'];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await AuditLog.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Seed Admin User
    await User.create({
      name: 'System Admin',
      email: 'admin@inventrack.com',
      password: 'admin123',
      role: 'Admin'
    });
    console.log('Seeded Admin User: admin@inventrack.com / admin123');

    // Seed Categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Seeded ${createdCategories.length} categories`);

    // Seed Products
    const createdProducts = await Product.insertMany(products);
    console.log(`Seeded ${createdProducts.length} products`);

    // Seed Orders (past 30 days)
    const orders = [];
    const logs = [];
    const now = new Date();

    for (let i = 0; i < 40; i++) {
      const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const daysAgo = Math.floor(Math.random() * 30);
      const orderDate = new Date(now);
      orderDate.setDate(now.getDate() - daysAgo);

      const status = ['Pending', 'Shipped', 'Delivered', 'Returned'][Math.floor(Math.random() * 4)];
      
      orders.push({
        customerName: customers[Math.floor(Math.random() * customers.length)],
        productName: product.name,
        quantity,
        orderDate,
        status
      });

      // Log movement for seed orders
      logs.push({
        product: product._id,
        productName: product.name,
        type: 'Outbound',
        quantityChange: -quantity,
        newStock: product.stock - (i * 0.1), // just mock levels
        reason: 'Seed order generation',
        timestamp: orderDate
      });
    }

    await Order.insertMany(orders);
    await AuditLog.insertMany(logs);
    console.log(`Seeded ${orders.length} orders and ${logs.length} movement logs`);

    console.log('Database seeded with Enterprise data!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
