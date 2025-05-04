const express = require('express');
const router = express.Router();

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

module.exports = router;