var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');

/* GET home page. */
router.get('/', function(req, res, next) {
  // This would normally be determined by authentication
  // For demo purposes, we're using a query parameter: ?admin=true
  const isAdmin = req.query.admin === 'true';
  
  // Get products from database
  productHelpers.getAllProducts().then((products) => {
    res.render('index', { 
      title: 'Shoppers Kart',
      products: products,
      isAdmin: isAdmin
    });
  }).catch(err => {
    console.error('Error fetching products for homepage:', err);
    res.render('error', { message: 'Failed to load products', error: err });
  });
});

/* GET search results */
router.get('/search', function(req, res, next) {
  const searchQuery = req.query.q;
  const isAdmin = req.query.admin === 'true';
  
  if (!searchQuery) {
    return res.redirect('/');
  }
  
  productHelpers.searchProducts(searchQuery).then((products) => {
    res.render('search-results', { 
      title: 'Search Results',
      searchQuery: searchQuery,
      products: products,
      isAdmin: isAdmin
    });
  }).catch(err => {
    console.error('Error searching products:', err);
    res.render('error', { message: 'Failed to search products', error: err });
  });
});



module.exports = router;


// No longer needed as we're using the database
// Keeping this export empty to avoid breaking any code that might still reference it
module.exports.sampleProducts = [];