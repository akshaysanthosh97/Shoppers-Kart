var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
var fs = require('fs');
var fileupload = require('express-fileupload');
var methodOverride = require('method-override');
var session = require('express-session');
require('dotenv').config();
var db=require('./config/connection');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'shoppingkartsecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' // Changed from 'strict' to 'lax' to allow back button navigation
  },
  rolling: true // Resets the cookie expiration time with each response
}));

// Add a middleware to check session validity on each request
app.use((req, res, next) => {
  if (req.session && req.session.user && !req.session._garbage) {
    // Session is valid, refresh it
    req.session._garbage = Date();
    req.session.touch();
  }
  next();
});

// Make user data available to all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.userLoggedIn = req.session.userLoggedIn;
  
  // Add cache control headers for all routes to prevent browser caching issues
  // This helps with the back button problem
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  
  next();
});

// Register partials recursively
function registerPartials(dir, prefix) {
  prefix = prefix || '';
  var filenames = fs.readdirSync(dir);
  
  filenames.forEach(function (filename) {
    var filePath = path.join(dir, filename);
    var stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively register partials in subdirectories
      registerPartials(filePath, prefix + filename + '/');
    } else {
      var matches = /^([^.]+).hbs$/.exec(filename);
      if (!matches) {
        return;
      }
      var name = prefix + matches[1];
      var template = fs.readFileSync(filePath, 'utf8');
      hbs.registerPartial(name, template);
    }
  });
}

// Register all partials in views directory
registerPartials(path.join(__dirname, 'views/partials'));
// Only register admin partials if directory exists
const adminPartialsPath = path.join(__dirname, 'views/admin/partials');
if (fs.existsSync(adminPartialsPath)) {
  registerPartials(adminPartialsPath, 'admin/partials/');
}

// Register custom Handlebars helpers
hbs.registerHelper('eq', function (a, b) {
  return a === b;
});

// Log registered partials for debugging
console.log('Registered partials:', Object.keys(hbs.handlebars.partials));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload());

// Method override middleware to support PUT and DELETE in forms
app.use(methodOverride('_method'));


// Connect to database before setting up routes
db.connect((err)=>{
  if(err) {
    console.error("Database connection error:", err);
    // Set up a middleware to handle all requests when database is down
    app.use((req, res) => {
      res.status(503).render('error', { 
        title: 'Service Unavailable',
        message: 'Database connection failed', 
        error: { 
          status: 503, 
          stack: 'The service is temporarily unavailable due to database connection issues. Please try again later.'
        }
      });
    });
  } else {
    console.log("Database connected successfully");
    
    // Set up routes after database connection is established
    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/admin', adminRouter);
    
    // Set up 404 handler after all routes
    app.use((req, res) => {
      res.status(404).render('error', {
        title: 'Page Not Found',
        message: 'Page Not Found',
        error: {
          status: 404,
          stack: 'The requested URL ' + req.url + ' was not found on this server.'
        }
      });
    });
  }
});

// Monitor database connection status
setInterval(() => {
  if (!db.get()) {
    console.log("Database connection not established. Retrying...");
    db.connect((err) => {
      if (err) {
        console.error("Database reconnection failed:", err);
      }
    });
  }
}, 5000); // Check every 5 seconds

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message || 'An error occurred';
  res.locals.error = req.app.get('env') === 'development' ? err : {
    status: err.status || 500,
    stack: 'Internal Server Error'
  };

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    message: res.locals.message,
    error: res.locals.error,
    title: 'Error'
  });
});

module.exports = app;
