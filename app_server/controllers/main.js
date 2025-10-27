const mongoose = require('mongoose');
require('../models/locations');
const Project = mongoose.model('Project');
const Review = mongoose.model('Review');
const Contact = mongoose.model('Contact');
// Homepage
const homePage = async (req, res) => {
  try {
    // Get featured projects
    const featuredProjects = await Project.find({ 
      status: 'published', 
      featured: true 
    }).limit(6);
    
    // Get latest projects
    const latestProjects = await Project.find({ 
      status: 'published' 
    }).sort({ createdAt: -1 }).limit(8);
    
    // Get featured reviews
    const featuredReviews = await Review.find({ 
      status: 'approved', 
      featured: true 
    }).limit(4);

    res.render('index', {
      title: 'Space Crafters - Interior Design Solutions',
      featuredProjects,
      latestProjects,
      featuredReviews
    });
  } catch (error) {
    console.error('Homepage error:', error);
    res.status(500).render('error', { 
      message: 'Server Error',
      error: req.app.get('env') === 'development' ? error : {}
    });
  }
};

// About page
const aboutPage = (req, res) => {
  res.render('about', {
    title: 'About Space Crafters'
  });
};


// Get the Contact model
// Show contact form
const contactGet = (req, res) => {
  res.render('contact');
};

// Handle contact form submission
const contactPost = async (req, res) => {
  try {
    console.log('Contact form data received:', req.body);
    const { name, email, phone, subject, message } = req.body;
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).send('Please fill in all required fields');
    }

    // Create new contact submission
    const newContact = new Contact({
      name,
      email,
      phone,
      subject,
      message
    });

    await newContact.save();

    // Redirect to thank you page
    res.render('thank-you', {
      message: 'Thank you for contacting us!',
      returnUrl: '/contact',
      returnText: 'Send Another Message'
    });

  } catch (err) {
    console.error('Error saving contact:', err);
    res.status(500).send('Error submitting form. Please try again.');
  }
};
const maintenanceTips = (req, res) => {
  res.render('maintenance-tips');
};

module.exports = {
  homePage,
  aboutPage,
  contactGet,
  contactPost,
  maintenanceTips
};