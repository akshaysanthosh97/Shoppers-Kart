const express = require('express');
const router = express.Router();
const userHelpers = require('../helpers/user-helpers');
const orderHelpers = require('../helpers/order-helpers');

// Middleware to check user authentication status
const checkAuth = (req, res, next) => {
  // Add cache control headers
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  
  if (!req.session.user) {
    return res.redirect('/users/login');
  }
  res.locals.isLoggedIn = true;
  res.locals.user = req.session.user;
  next();
};

// Checkout page route - requires authentication
router.get('/', checkAuth, async (req, res) => {
  try {
    res.render('user/checkout', {
      title: 'Checkout',
      user: req.session.user,
      isLoggedIn: true
    });
  } catch (error) {
    console.error('Error loading checkout page:', error);
    res.render('error', { message: 'Failed to load checkout page', error: error });
  }
});

// Place order endpoint
router.post('/place-order', checkAuth, async (req, res) => {
  try {
    const { shippingInfo, paymentMethod } = req.body;
    const userId = req.session.user._id;
    
    // Create order in database
    const orderData = {
      userId,
      shippingAddress: shippingInfo,
      paymentMethod,
      date: new Date(),
      status: 'Placed',
      // Additional order details would be added here
    };
    
    // Save order to database (assuming this function exists in order-helpers)
    const orderId = await orderHelpers.placeOrder(userId, orderData);
    
    // Get the order details to display on confirmation page
    const order = await orderHelpers.getOrderById(orderId);
    
    // Render order confirmation page
    res.render('user/order-confirmation', {
      title: 'Order Confirmation',
      order,
      user: req.session.user,
      isLoggedIn: true
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;