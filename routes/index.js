var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // This would normally be determined by authentication
  // For demo purposes, we're using a query parameter: ?admin=true
  const isAdmin = req.query.admin === 'true';
  
  // Sample products data - this will be replaced with database query later
  const sampleProducts = [
    { 
      id: 1, 
      name: 'Premium Laptop', 
      price: 999.99, 
      description: 'High-performance laptop with the latest processor, 16GB RAM, and 512GB SSD storage. Perfect for gaming and professional work.', 
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
      category: 'Electronics',
      badge: 'new'
    },
    { 
      id: 2, 
      name: 'Smartphone Pro', 
      price: 699.99, 
      description: 'Latest smartphone model with 6.7-inch display, triple camera system, and all-day battery life.', 
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1527&q=80',
      category: 'Electronics',
      badge: 'sale'
    },
    { 
      id: 3, 
      name: 'Noise-Cancelling Headphones', 
      price: 149.99, 
      description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and comfortable over-ear design.', 
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      category: 'Electronics'
    },
    { 
      id: 4, 
      name: 'Smart Watch', 
      price: 249.99, 
      description: 'Feature-packed smartwatch with health monitoring, GPS, and 5-day battery life.', 
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1399&q=80',
      category: 'Electronics',
      badge: 'new'
    },
    { 
      id: 5, 
      name: 'Wireless Earbuds', 
      price: 89.99, 
      description: 'True wireless earbuds with premium sound quality, touch controls, and compact charging case.', 
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1378&q=80',
      category: 'Electronics'
    },
    { 
      id: 6, 
      name: 'Digital Camera', 
      price: 599.99, 
      description: 'Professional-grade digital camera with 24MP sensor, 4K video recording, and interchangeable lenses.', 
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
      category: 'Electronics',
      badge: 'sale'
    },
    { 
      id: 7, 
      name: 'Bluetooth Speaker', 
      price: 129.99, 
      description: 'Portable Bluetooth speaker with 360° sound, waterproof design, and 20-hour battery life. Perfect for outdoor adventures.', 
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      category: 'Electronics',
      badge: 'new'
    },
    { 
      id: 8, 
      name: 'Gaming Console', 
      price: 499.99, 
      description: 'Next-generation gaming console with 4K graphics, 1TB storage, and wireless controller. Includes access to online gaming network.', 
      image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1619&q=80',
      category: 'Electronics',
      badge: 'sale'
    }
  ];

  
  // In the future, this will be replaced with a database query
  // Example: const products = await Product.find().limit(6);
  
  res.render('index', { 
    title: 'Shoppers Kart',
    products: sampleProducts,
    isAdmin: isAdmin
  });
});



module.exports = router;


const sampleProducts = [
    { 
      id: 1, 
      name: 'Premium Laptop', 
      price: 999.99, 
      description: 'High-performance laptop with the latest processor, 16GB RAM, and 512GB SSD storage. Perfect for gaming and professional work.', 
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
      category: 'Electronics',
      badge: 'new'
    },
    { 
      id: 2, 
      name: 'Smartphone Pro', 
      price: 699.99, 
      description: 'Latest smartphone model with 6.7-inch display, triple camera system, and all-day battery life.', 
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1527&q=80',
      category: 'Electronics',
      badge: 'sale'
    },
    { 
      id: 3, 
      name: 'Noise-Cancelling Headphones', 
      price: 149.99, 
      description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and comfortable over-ear design.', 
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      category: 'Electronics'
    },
    { 
      id: 4, 
      name: 'Smart Watch', 
      price: 249.99, 
      description: 'Feature-packed smartwatch with health monitoring, GPS, and 5-day battery life.', 
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1399&q=80',
      category: 'Electronics',
      badge: 'new'
    },
    { 
      id: 5, 
      name: 'Wireless Earbuds', 
      price: 89.99, 
      description: 'True wireless earbuds with premium sound quality, touch controls, and compact charging case.', 
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1378&q=80',
      category: 'Electronics'
    },
    { 
      id: 6, 
      name: 'Digital Camera', 
      price: 599.99, 
      description: 'Professional-grade digital camera with 24MP sensor, 4K video recording, and interchangeable lenses.', 
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80',
      category: 'Electronics',
      badge: 'sale'
    },
    { 
      id: 7, 
      name: 'Bluetooth Speaker', 
      price: 129.99, 
      description: 'Portable Bluetooth speaker with 360° sound, waterproof design, and 20-hour battery life. Perfect for outdoor adventures.', 
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      category: 'Electronics',
      badge: 'new'
    },
    { 
      id: 8, 
      name: 'Gaming Console', 
      price: 499.99, 
      description: 'Next-generation gaming console with 4K graphics, 1TB storage, and wireless controller. Includes access to online gaming network.', 
      image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1619&q=80',
      category: 'Electronics',
      badge: 'sale'
    }
  ];

module.exports.sampleProducts = sampleProducts;