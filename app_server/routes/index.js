const express = require('express');
const router = express.Router();
const mainController = require('../controllers/main');
const locationsController = require('../controllers/locations');
const othersController = require('../controllers/others');
const authController = require('../controllers/auth');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');


// Main routes
router.get('/', mainController.homePage);
router.get('/about', mainController.aboutPage);
router.get('/contact', mainController.contactGet);
router.post('/contact', mainController.contactPost);


// Project routes
router.get('/projects', locationsController.projectsList);
router.get('/projects/category/:category', locationsController.projectsByCategory);
router.get('/projects/:id', locationsController.projectDetail);
//maintanace tips
router.get('/maintenance-tips', mainController.maintenanceTips);


// Reviews routes
router.get('/reviews', othersController.reviewsList);
router.get('/reviews/new', othersController.reviewsCreate);
router.post('/reviews/new', othersController.reviewsCreatePost);


// Auth routes
router.get('/login', authController.loginGet);
router.post('/login', authController.loginPost);
router.get('/logout', authController.logout);

// Registration routes (NEW)
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', { 
        title: 'Register',
        error: 'Email already registered' 
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.render('register', { 
      title: 'Register',
      success: 'Registration successful! You can now login.' 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.render('register', { 
      title: 'Register',
      error: 'Registration failed. Please try again.' 
    });
  }
});


module.exports = router;
