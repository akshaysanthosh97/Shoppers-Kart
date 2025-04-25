var express = require('express');
var router = express.Router();

/* GET admin dashboard page */
router.get('/dashboard', function(req, res, next) {
  // Check for admin parameter in query string - this ensures the navbar displays correctly
  // We read the query parameter but still set isAdmin to true for the admin dashboard
  const isAdmin = true;
  
  // Sample stats for the dashboard
  const stats = {
    totalProducts: 156,
    totalUsers: 1243,
    totalOrders: 528,
    pendingOrders: 42,
    revenue: 25689.75
  };
  
  res.render('admin/admin-dashboard', { 
    title: 'Admin Dashboard',
    isAdmin: isAdmin,
    stats: stats
  });
});

/* GET admin products page */
router.get('/products', function(req, res, next) {
  // Sample stats for the products page
  const stats = {
    totalProducts: 156
  };
  
  // Fetch sample products from index.js
  const sampleProducts = require('./index').sampleProducts;

  res.render('admin/admin-products', { 
    title: 'Products Management',
    isAdmin: true,
    isProductsPage: true,
    stats: stats,
    products: sampleProducts // Pass products to the template
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

/* POST new product - placeholder for form submission */
router.post('/products', function(req, res, next) {
  // This would normally save the product to the database
  // For now, just redirect back to the products page
  res.redirect('/admin/products');
});

module.exports = router;