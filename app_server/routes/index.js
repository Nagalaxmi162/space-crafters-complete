const express = require('express');
const router = express.Router();
const mainController = require('../controllers/main');
const locationsController = require('../controllers/locations');
const othersController = require('../controllers/others');

// Main routes
router.get('/', mainController.homePage);
router.get('/about', mainController.aboutPage);
router.get('/contact', mainController.contactPage);
router.post('/contact', mainController.contactSubmit);

// Project routes
router.get('/projects', locationsController.projectsList);
router.get('/projects/category/:category', locationsController.projectsByCategory);
router.get('/projects/:id', locationsController.projectDetail);

// Review routes
router.get('/reviews', locationsController.reviewsList);
router.get('/reviews/new', locationsController.reviewForm);
router.post('/reviews/new', locationsController.reviewSubmit);

// Auth routes
router.get('/login', othersController.loginPage);
router.post('/login', othersController.loginSubmit);
router.get('/register', othersController.registerPage);
router.post('/register', othersController.registerSubmit);
router.get('/logout', othersController.logout);

module.exports = router;