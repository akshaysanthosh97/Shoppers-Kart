var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
var fs = require('fs');
var fileupload = require('express-fileupload');
var db=require('./config/connection');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();

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

// Connect to database before setting up routes
db.connect((err)=>{
  if(err) {
    console.log("Connection error: "+err);
    // Render an error page instead of setting up routes
    app.use('/', (req, res) => {
      res.render('error', { 
        message: 'Database connection failed', 
        error: { status: 500, stack: err.message } 
      });
    });
  } else {
    console.log("Database connected successfully");
    
    // Only set up routes after database connection is established
    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/admin', adminRouter);
  }
});

// Ensure database is connected before starting the server
if (!db.get()) {
  console.log("Waiting for database connection to be established...");
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
