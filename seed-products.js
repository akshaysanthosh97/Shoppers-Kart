const { MongoClient } = require('mongodb');

// Connection URL and Database Name
const url = 'mongodb://localhost:27017';
const dbName = 'Shopping';

// Sample products data
const sampleProducts = [
  { 
    name: 'Premium Laptop', 
    price: 999.99, 
    description: 'High-performance laptop with the latest processor, 16GB RAM, and 512GB SSD storage. Perfect for gaming and professional work.', 
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    category: 'Electronics',
    badge: 'new'
  },
  { 
    name: 'Smartphone Pro', 
    price: 699.99, 
    description: 'Latest smartphone model with 6.7-inch display, triple camera system, and all-day battery life.', 
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1527&q=80',
    category: 'Electronics',
    badge: 'sale'
  },
  { 
    name: 'Noise-Cancelling Headphones', 
    price: 149.99, 
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and comfortable over-ear design.', 
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    category: 'Electronics'
  },
  { 
    name: 'Smart Watch', 
    price: 249.99, 
    description: 'Feature-packed smartwatch with health monitoring, GPS, and 5-day battery life.', 
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1399&q=80',
    category: 'Electronics',
    badge: 'new'
  },
  { 
    name: 'Wireless Earbuds', 
    price: 89.99, 
    description: 'True wireless earbuds with premium sound quality, touch controls, and compact charging case.', 
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1378&q=80',
    category: 'Electronics'
  },
  { 
    name: 'Digital Camera', 
    price: 599.99, 
    description: 'Professional-grade digital camera with 24MP sensor, 4K video recording, and interchangeable lenses.', 
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
    category: 'Electronics',
    badge: 'sale'
  },
  { 
    name: 'Bluetooth Speaker', 
    price: 129.99, 
    description: 'Portable Bluetooth speaker with 360° sound, waterproof design, and 20-hour battery life. Perfect for outdoor adventures.', 
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    category: 'Electronics',
    badge: 'new'
  },
  { 
    name: 'Gaming Console', 
    price: 499.99, 
    description: 'Next-generation gaming console with 4K graphics, 1TB storage, and wireless controller. Includes access to online gaming network.', 
    image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1619&q=80',
    category: 'Electronics',
    badge: 'sale'
  }
];

async function seedDatabase() {
  let client;

  try {
    // Connect to the MongoDB server
    client = await MongoClient.connect(url, { useUnifiedTopology: true });
    console.log('Connected to MongoDB server');

    const db = client.db(dbName);
    
    // Check if products collection already has data
    const count = await db.collection('products').countDocuments();
    
    if (count > 0) {
      console.log(`Database already has ${count} products. Skipping seed operation.`);
    } else {
      // Insert the sample products
      const result = await db.collection('products').insertMany(sampleProducts);
      console.log(`${result.insertedCount} products successfully inserted into the database`);
    }

  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    if (client) {
      await client.close();
      console.log('Database connection closed');
    }
  }
}

// Run the seed function
seedDatabase();

/*
  To run this script:
  1. Make sure MongoDB is running on your machine
  2. Run: node seed-products.js
  
  This will populate your database with sample products for testing.
*/