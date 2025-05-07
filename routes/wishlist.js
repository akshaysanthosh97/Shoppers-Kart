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

// Wishlist page route - requires authentication
router.get('/', checkAuth, async (req, res) => {
  try {
    // Get wishlist items from database
    const wishlistItems = await userHelpers.getWishlistItems(req.session.user._id);
    
    res.render('user/wishlist', {
      title: 'My Wishlist',
      user: req.session.user,
      wishlist: wishlistItems, // Changed variable name to match what's used in the template
      isLoggedIn: true
    });
  } catch (error) {
    console.error('Error loading wishlist:', error);
    res.render('error', { message: 'Failed to load wishlist', error: error });
  }
});

// Add item to wishlist
router.post('/add', checkAuth, async (req, res) => {
  try {
    await userHelpers.addToWishlist(req.session.user._id, req.body.productId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Remove item from wishlist
router.post('/remove', checkAuth, async (req, res) => {
  try {
    await userHelpers.removeFromWishlist(req.session.user._id, req.body.productId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;