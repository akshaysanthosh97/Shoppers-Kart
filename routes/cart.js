const express = require('express');
const router = express.Router();
const userHelpers = require('../helpers/user-helpers');
const productHelpers = require('../helpers/product-helpers');

// Middleware to check user authentication status
const checkAuth = (req, res, next) => {
  // Add cache control headers
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  
  // Set authentication status in response locals
  res.locals.isLoggedIn = !!req.session.user;
  res.locals.user = req.session.user || null;
  next();
};

// Cart page route - accessible to both guest and authenticated users
router.get('/', checkAuth, async (req, res) => {
  try {
    if (res.locals.isLoggedIn) {
      // For authenticated users, fetch cart from database
      const cartItems = await userHelpers.getCartProducts(req.session.user._id);
      const totalAmount = cartItems.length > 0 
        ? cartItems.reduce((acc, curr) => acc + (curr.quantity * curr.product.price), 0)
        : 0;
      
      res.render('user/cart', {
        title: 'Your Cart',
        user: req.session.user,
        cartItems: cartItems,
        totalAmount: totalAmount,
        isLoggedIn: true
      });
    } else {
      // For guest users, render the cart page without items
      // Items will be loaded client-side from localStorage
      res.render('user/cart', {
        title: 'Your Cart',
        isLoggedIn: false
      });
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.render('error', { message: 'Failed to load cart', error: error });
  }
});

// API endpoint to get product details for guest cart
router.get('/api/products/:id', async (req, res) => {
  try {
    const product = await productHelpers.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

// API endpoint to update cart item quantity
router.post('/api/update-quantity', checkAuth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (res.locals.isLoggedIn) {
      // For authenticated users, update in database
      await userHelpers.updateCartQuantity(req.session.user._id, productId, quantity);
      const cartItems = await userHelpers.getCartProducts(req.session.user._id);
      const totalAmount = cartItems.reduce((acc, curr) => acc + (curr.quantity * curr.product.price), 0);
      
      res.json({
        success: true,
        cartItems,
        totalAmount
      });
    } else {
      // For guest users, just return success
      res.json({ success: true });
    }
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    res.status(500).json({ error: 'Failed to update cart quantity' });
  }
});

// API endpoint to get cart count
router.get('/api/cart-count', checkAuth, async (req, res) => {
  try {
    if (res.locals.isLoggedIn) {
      const count = await userHelpers.getCartCount(req.session.user._id);
      res.json({ count });
    } else {
      res.json({ count: 0 }); // Guest cart count is managed client-side
    }
  } catch (error) {
    console.error('Error getting cart count:', error);
    res.status(500).json({ error: 'Failed to get cart count' });
  }
});

module.exports = router;