var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers');

// Middleware to check if user is logged in
const verifyLogin = (req, res, next) => {
  if (req.session.user) {
    // Add cache control headers to prevent caching
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  } else {
    res.redirect('/users/login');
  }
};

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/users/view-products');
});

// Login routes
router.get('/login', (req, res) => {
  // Always add cache control headers to prevent caching
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  
  if (req.session.user && req.session.userLoggedIn) {
    res.redirect('/');
  } else {
    res.render('user/login', { loginError: req.session.loginError, signupSuccess: req.session.signupSuccess });
    req.session.loginError = null;
    req.session.signupSuccess = null;
  }
});

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body)
    .then((user) => {
      req.session.user = user;
      req.session.userLoggedIn = true;
      res.redirect('/');
    })
    .catch((err) => {
      req.session.loginError = err.message;
      res.redirect('/users/login');
    });
});

// Signup routes
router.get('/signup', (req, res) => {
  // Add cache control headers to prevent caching
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('user/signup', { signupError: req.session.signupError });
    req.session.signupError = null;
  }
});

router.post('/signup', (req, res) => {
  // Validate password match
  if (req.body.password !== req.body.confirmPassword) {
    req.session.signupError = 'Passwords do not match';
    return res.redirect('/users/signup');
  }
  
  // Remove confirmPassword from the data to be stored
  delete req.body.confirmPassword;
  
  userHelpers.doSignup(req.body)
    .then((result) => {
      req.session.signupSuccess = 'Account created successfully. Please login.';
      res.redirect('/users/login');
    })
    .catch((err) => {
      req.session.signupError = err.message;
      res.redirect('/users/signup');
    });
});

// Logout route
router.get('/logout', (req, res) => {
  // Add cache control headers to prevent caching
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  
  req.session.user = null;
  req.session.userLoggedIn = false;
  res.redirect('/');
});

// View products route
router.get('/view-products', (req, res) => {
  // Add cache control headers to prevent caching
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  
  res.render('user/view-products', {
    title: 'Shopping Kart',
    user: req.session.user
  });
});

module.exports = router;
