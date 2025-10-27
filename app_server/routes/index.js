const express = require('express');
const router = express.Router();
const mainController = require('../controllers/main');
const locationsController = require('../controllers/locations');
const othersController = require('../controllers/others');
const authController = require('../controllers/auth');

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
router.get('/reviews/new',othersController.reviewsCreate);
router.post('/reviews/new', othersController.reviewsCreatePost);

// Auth routes
router.get('/login', authController.loginGet);
router.post('/login', authController.loginPost);
router.get('/logout', authController.logout);

module.exports = router;