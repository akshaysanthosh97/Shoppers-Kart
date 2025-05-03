var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers');
var productHelpers = require('../helpers/product-helpers');

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
      // Regenerate session when signing in to prevent fixation
      req.session.regenerate(function(err) {
        if (err) {
          console.error('Error regenerating session:', err);
          req.session.loginError = 'Login failed. Please try again.';
          return res.redirect('/users/login');
        }
        
        // Store user information in session
        req.session.user = user;
        req.session.userLoggedIn = true;
        
        // Save the session before redirection to ensure page load does not happen before session is saved
        req.session.save(function(err) {
          if (err) {
            console.error('Error saving session:', err);
          }
          res.redirect('/');
        });
      });
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
  
  // Properly destroy the session instead of just nullifying properties
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    // Clear the session cookie
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
}); 

// View products route
router.get('/view-products', (req, res) => {
  // Add cache control headers to prevent caching
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  
  // Get products from database
  productHelpers.getAllProducts().then((products) => {
    res.render('user/view-products', {
      title: 'Shopping Kart',
      user: req.session.user,
      products: products
    });
  }).catch(err => {
    console.error('Error fetching products:', err);
    res.render('error', { message: 'Failed to load products', error: err });
  });
});

// Cart routes
router.get('/cart', verifyLogin, async (req, res) => {
  // Add cache control headers to prevent caching
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  
  try {
    const cartItems = await userHelpers.getCartProducts(req.session.user._id);
    let totalAmount = 0;
    if (cartItems.length > 0) {
      totalAmount = cartItems.reduce((acc, curr) => {
        return acc + (curr.quantity * curr.product.price);
      }, 0);
    }
    
    res.render('user/cart', {
      title: 'Your Cart',
      user: req.session.user,
      cartItems: cartItems,
      totalAmount: totalAmount
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.render('error', { message: 'Failed to load cart', error: error });
  }
});

router.post('/add-to-cart', verifyLogin, async (req, res) => {
  try {
    await userHelpers.addToCart(req.session.user._id, req.body.productId);
    // Get updated cart count after adding item
    const cartCount = await userHelpers.getCartCount(req.session.user._id);
    res.json({ status: 'success', cartCount: cartCount });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/remove-from-cart', verifyLogin, (req, res) => {
  userHelpers.removeCartItem(req.session.user._id, req.body.productId)
    .then(() => {
      res.json({ status: true });
    })
    .catch((error) => {
      console.error('Error removing from cart:', error);
      res.status(500).json({ status: false, error: error.message });
    });
});

router.get('/get-cart-count', verifyLogin, async (req, res) => {
  try {
    const count = await userHelpers.getCartCount(req.session.user._id);
    res.json({ count: count });
  } catch (error) {
    console.error('Error getting cart count:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
