const express = require('express');
const router = express.Router();

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).render('error', {
      message: 'Access denied'
    });
  }
  next();
};

// User profile page
router.get('/profile', requireAuth, (req, res) => {
  res.render('profile', {
    title: 'My Profile - Space Crafters'
  });
});

// Admin dashboard
router.get('/admin', requireAdmin, (req, res) => {
  res.render('admin/dashboard', {
    title: 'Admin Dashboard - Space Crafters'
  });
});

module.exports = router;