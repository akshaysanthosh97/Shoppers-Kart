var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')

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
router.post('/products/:id', function(req, res, next) {
  const productId = req.params.id;
  const productData = {
    name: req.body.name,
    category: req.body.category,
    price: parseFloat(req.body.price),
    description: req.body.description,
    badge: req.body.badge || null
  };
  
  productHelpers.updateProduct(productId, productData).then(() => {
    // Handle image update if present
    if (req.files && req.files.image) {
      let image = req.files.image;
      image.mv('./public/product-images/'+productId+'.jpg', (err) => {
        if (err) {
          console.error('Error updating image:', err);
        }
        res.redirect('/admin/products');
      });
    } else {
      res.redirect('/admin/products');
    }
  }).catch(err => {
    console.error('Error updating product:', err);
    res.render('error', { message: 'Failed to update product', error: err });
  });
});

/* DELETE product */
router.get('/products/:id/delete', function(req, res, next) {
  const productId = req.params.id;
  productHelpers.deleteProduct(productId).then(() => {
    res.redirect('/admin/products');
  }).catch(err => {
    console.error('Error deleting product:', err);
    res.render('error', { message: 'Failed to delete product', error: err });
  });
});

module.exports = router;