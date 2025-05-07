const express = require('express');
const router = express.Router();
const userHelpers = require('../helpers/user-helpers');

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

// Account page route - requires authentication
router.get('/', checkAuth, async (req, res) => {
  try {
    // Get user details from database
    const userDetails = await userHelpers.getUserDetails(req.session.user._id);
    
    // Get wishlist items for the account page
    const wishlistItems = await userHelpers.getWishlistItems(req.session.user._id);
    
    // Get user's order history
    const orderHelpers = require('../helpers/order-helpers');
    let orders = [];
    try {
      orders = await orderHelpers.getUserOrders(req.session.user._id);
      
      // Add status color for badges
      orders = orders.map(order => {
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
    } catch (orderErr) {
      console.error('Error fetching orders:', orderErr);
      // Continue even if orders can't be fetched
    }
    
    res.render('user/account', {
      title: 'My Account',
      user: userDetails,
      wishlist: wishlistItems,
      orders: orders,
      isLoggedIn: true
    });
  } catch (error) {
    console.error('Error loading account page:', error);
    res.render('error', { message: 'Failed to load account page', error: error });
  }
});

// Update profile endpoint
router.post('/update-profile', checkAuth, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    // Update user profile in database
    await userHelpers.updateUserProfile(req.session.user._id, { name, email, phone });
    
    // Update session data to reflect changes across the site
    req.session.user.name = name;
    req.session.user.email = email;
    req.session.user.phone = phone;
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update settings endpoint
router.post('/update-settings', checkAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword, notifications } = req.body;
    // Update user settings in database
    await userHelpers.updateUserSettings(req.session.user._id, { currentPassword, newPassword, notifications });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;