const express = require('express');
const router = express.Router();

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

// About page route
router.get('/', checkAuth, (req, res) => {
  try {
    res.render('user/about', {
      title: 'About Us',
      isLoggedIn: res.locals.isLoggedIn,
      user: res.locals.user
    });
  } catch (error) {
    console.error('Error loading about page:', error);
    res.render('error', { message: 'Failed to load about page', error: error });
  }
});

module.exports = router;