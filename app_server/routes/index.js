const express = require('express');
const router = express.Router();
const mainController = require('../controllers/main');
const locationsController = require('../controllers/locations');
const othersController = require('../controllers/others');
const authController = require('../controllers/auth');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');

// Registration routes (NEW)
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});
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



router.post('/register', async (req, res) => {
  try {
    console.log('=== REGISTRATION ATTEMPT ===');
    console.log('Form data received:', req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log('ERROR: Missing email or password');
      return res.render('register', { 
        title: 'Register',
        error: 'All fields are required',
        success: null
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    console.log('Existing user check:', existingUser ? 'FOUND' : 'NOT FOUND');
    
    if (existingUser) {
      return res.render('register', { 
        title: 'Register',
        error: 'Email already registered',
        success: null
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully ✅');

    // Create user
    const newUser = new User({
      email: email.trim().toLowerCase(),
      password: hashedPassword
    });

    console.log('User object created:', newUser);

    // Save user
    const savedUser = await newUser.save();
    console.log('✅ USER SAVED TO DATABASE:', savedUser);

    res.render('register', { 
      title: 'Register',
      error: null,
      success: 'Registration successful! You can now login.' 
    });
  } catch (error) {
    console.error('❌ REGISTRATION ERROR:', error);
    res.render('register', { 
      title: 'Register',
      error: 'Registration failed: ' + error.message,
      success: null
    });
  }
});
 
module.exports = router;
