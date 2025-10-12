const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import database configuration
require('./app_server/model/db');
// Import routes
const routes = require('./app_server/routes/index');
const users = require('./app_server/routes/users');
const { error } = require('console');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false // Disable for development
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// View engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'space-crafters-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/space-crafters'
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Make user available in all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Routes
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error',{
    message: err.message,
    error: err
  });
});

module.exports = app;