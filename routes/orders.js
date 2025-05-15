const express = require('express');
const router = express.Router();
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

// Orders page route - requires authentication
router.get('/', checkAuth, async (req, res) => {
  try {
    const orders = await orderHelpers.getUserOrders(req.session.user._id);
    
    // Add status color for badges
    const ordersWithStatus = orders.map(order => {
      let statusColor = 'secondary';
      switch(order.status) {
        case 'Placed': statusColor = 'info'; break;
        case 'Processing': statusColor = 'primary'; break;
        case 'Shipped': statusColor = 'warning'; break;
        case 'Delivered': statusColor = 'success'; break;
        case 'Cancelled': statusColor = 'danger'; break;
      }
      return {...order, statusColor};
    });

    res.render('user/orders', {
      title: 'My Orders',
      user: req.session.user,
      orders: ordersWithStatus,
      isLoggedIn: true
    });
  } catch (error) {
    console.error('Error loading orders:', error);
    res.render('error', { message: 'Failed to load orders', error: error });
  }
});

// Get single order details
router.get('/:orderId', checkAuth, async (req, res) => {
  try {
    const order = await orderHelpers.getOrderById(req.params.orderId);
    if (!order) {
      return res.render('error', { message: 'Order not found' });
    }
    
    // Verify the order belongs to the logged-in user
    if (order.userId.toString() !== req.session.user._id.toString()) {
      return res.render('error', { message: 'Unauthorized access' });
    }
    
    res.render('user/order-details', {
      title: 'Order Details',
      user: req.session.user,
      order: order,
      isLoggedIn: true
    });
  } catch (error) {
    console.error('Error loading order details:', error);
    res.render('error', { message: 'Failed to load order details', error: error });
  }
});

module.exports = router;