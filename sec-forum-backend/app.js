var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var apiRouter = require('./routes/api');
var csrf = require('lusca').csrf;
var rateLimit = require('express-rate-limit');
var session = require('express-session');
const { version } = require('os');
var { connectToDatabase } = require('./db'); // Import the MongoDB connection module

var app = express();

var limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // max 500 requests per windowMs
});
// apply to all requests
app.use(limiter);

// TODO - Add csrf protection.

// MongoDB connection setup
connectToDatabase().catch(console.dir);

app.use(helmet()); // Use Helmet for security

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', apiRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message,
    stack: err.stack || 'No stack trace available'

    //...(req.app.get('env') === 'development' && { stack: err.stack })
  });
});


module.exports = app;

