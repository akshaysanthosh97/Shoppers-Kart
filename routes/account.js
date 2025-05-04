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
    
    res.render('user/account', {
      title: 'My Account',
      user: userDetails,
      isLoggedIn: true
    });
  } catch (error) {
    console.error('Error loading account page:', error);
    res.render('error', { message: 'Failed to load account page', error: error });
  }
});

module.exports = router;