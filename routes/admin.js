var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');
var userHelpers = require('../helpers/user-helpers');
var orderHelpers = require('../helpers/order-helpers');

// Middleware to fetch dashboard stats
async function getDashboardStats() {
  try {
    const [products, totalUsers, totalOrders, pendingOrders, revenue] = await Promise.all([
      productHelpers.getAllProducts(),
      userHelpers.getTotalUsers(),
      orderHelpers.getTotalOrders(),
      orderHelpers.getPendingOrders(),
      orderHelpers.getTotalRevenue()
    ]);
    
    return {
      totalProducts: products.length,
      totalUsers,
      totalOrders,
      pendingOrders,
      revenue
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

/* GET admin dashboard page */
router.get('/dashboard', function(req, res, next) {
  // Check for admin parameter in query string - this ensures the navbar displays correctly
  // We read the query parameter but still set isAdmin to true for the admin dashboard
  const isAdmin = true;
  
  // Get real stats from database
  getDashboardStats().then((stats) => {
    

    
    res.render('admin/admin-dashboard', { 
      title: 'Admin Dashboard',
      isAdmin: isAdmin,
      stats: stats
    });
  }).catch(err => {
    console.error('Error fetching data for dashboard:', err);
    res.render('error', { message: 'Failed to load dashboard data', error: err });
  });
});

/* GET admin products page */
router.get('/products', function(req, res, next) {
  // Get products from database
  productHelpers.getAllProducts().then((products) => {
    // Real stats from database
    const stats = {
      totalProducts: products.length
    };

    res.render('admin/admin-products', { 
      title: 'Products Management',
      isAdmin: true,
      isProductsPage: true,
      stats: stats,
      products: products // Pass products from database to the template
    });
  }).catch(err => {
    console.error('Error fetching products:', err);
    res.render('error', { message: 'Failed to load products', error: err });
  });
});

/* Search products - AJAX endpoint */
router.get('/search-products', function(req, res, next) {
  const searchQuery = req.query.q || '';
  
  // If search query is empty, return all products
  if (!searchQuery.trim()) {
    productHelpers.getAllProducts().then((products) => {
      res.json(products);
    }).catch(err => {
      console.error('Error fetching all products:', err);
      res.status(500).json({ error: 'Failed to fetch products' });
    });
    return;
  }
  
  // Search for products matching the query
  productHelpers.searchProducts(searchQuery).then((products) => {
    res.json(products);
  }).catch(err => {
    console.error('Error searching products:', err);
    res.status(500).json({ error: 'Failed to search products' });
  });
});

/* GET new product form */
router.get('/products/new', function(req, res, next) {
  res.render('admin/admin-product-new', { 
    title: 'Add New Product',
    isAdmin: true,
    isProductsPage: true
  });
});

/* POST new product - handle form submission */
router.post('/products', function(req, res, next) {
  // Process the product data
  const productData = {
    name: req.body.name,
    category: req.body.category,
    price: parseFloat(req.body.price),
    description: req.body.description,
    badge: req.body.badge || null
  };
  
  productHelpers.addProduct(productData, (id) => {
    if (!id) {
      return res.render('admin/admin-product-new', {
        title: 'Add New Product',
        isAdmin: true,
        isProductsPage: true,
        error: 'Failed to add product'
      });
    }
    
    // Handle image upload if present
    if (req.files && req.files.image) {
      let image = req.files.image;
      // Create directory if it doesn't exist
      const fs = require('fs');
      const dir = './public/product-images';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      image.mv('./public/product-images/'+id+'.jpg', (err) => {
        if (err) {
          console.error('Error saving image:', err);
          return res.render('admin/admin-product-new', {
            title: 'Add New Product',
            isAdmin: true,
            isProductsPage: true,
            error: 'Product added but failed to save image'
          });
        }
        
        // Update the product with image path
        productHelpers.updateProduct(id, {
          image: '/product-images/'+id+'.jpg'
        }).then(() => {
          res.redirect('/admin/products');
        }).catch(err => {
          console.error('Error updating product with image:', err);
          res.redirect('/admin/products');
        });
      });
    } else {
      res.redirect('/admin/products');
    }
  });
});

/* GET edit product form */
router.get('/products/:id/edit', function(req, res, next) {
  const productId = req.params.id;
  productHelpers.getProductDetails(productId).then((product) => {
    res.render('admin/admin-product-edit', { 
      title: 'Edit Product',
      isAdmin: true,
      isProductsPage: true,
      product: product
    });
  }).catch(err => {
    console.error('Error fetching product details:', err);
    res.render('error', { message: 'Failed to load product details', error: err });
  });
});

/* PUT update product */
router.put('/products/:id', function(req, res, next) {
  const productId = req.params.id;
  const productData = {
    name: req.body.name,
    category: req.body.category,
    price: parseFloat(req.body.price),
    description: req.body.description,
    badge: req.body.badge || null
  };
  productHelpers.updateProduct(productId, productData)
    .then((result) => {
      console.log('Product update result:', result);
      // Handle image update if present
      if (req.files && req.files.image) {
        let image = req.files.image;
        // Create directory if it doesn't exist
        const fs = require('fs');
        const dir = './public/product-images';
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        image.mv('./public/product-images/'+productId+'.jpg', (err) => {
          if (err) {
            console.error('Error updating image:', err);
          }
          res.redirect('/admin/products');
        });
      } else {
        res.redirect('/admin/products');
      }
    })
    .catch(err => {
      console.error('Error updating product:', err);
      res.render('error', { message: 'Failed to update product', error: err });
    });
});

/* GET admin users page */
router.get('/users', async function(req, res, next) {
  try {
    const users = await userHelpers.getAllUsers();
    const totalUsers = await userHelpers.getTotalUsers();
    // Pagination logic can be added here if needed
    res.render('admin/admin-users', {
      title: 'Users Management',
      isAdmin: true,
      isUsersPage: true,
      users: users,
      stats: { totalUsers }
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.render('error', { message: 'Failed to load users', error: err });
  }
});

/* GET admin sales page */
router.get('/sales', async function(req, res, next) {
  try {
    const revenue = await orderHelpers.getTotalRevenue();
    const totalOrders = await orderHelpers.getTotalOrders();
    const pendingOrders = await orderHelpers.getPendingOrders();
    res.render('admin/admin-sales', {
      title: 'Sales Analytics',
      isAdmin: true,
      isSalesPage: true,
      stats: {
        revenue,
        totalOrders,
        pendingOrders
      }
    });
  } catch (err) {
    console.error('Error fetching sales data:', err);
    res.render('error', { message: 'Failed to load sales data', error: err });
  }
});

/* PUT toggle user status */
router.put('/users/:id/toggle-status', async function(req, res, next) {
  try {
    const userId = req.params.id;
    const updatedUser = await userHelpers.toggleUserStatus(userId);
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('Error toggling user status:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* GET admin orders page */
router.get('/orders', async function(req, res, next) {
  try {
    const orders = await orderHelpers.getAllOrders();
    const stats = {
      totalOrders: orders.length
    };

    res.render('admin/admin-orders', { 
      title: 'Orders Management',
      isAdmin: true,
      isOrdersPage: true,
      stats: stats,
      orders: orders
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.render('error', { message: 'Failed to load orders', error: err });
  }
});

/* PUT update order status */
router.put('/orders/:id/status', async function(req, res, next) {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const updatedOrder = await orderHelpers.updateOrderStatus(orderId, status);
    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;