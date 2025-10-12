const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const Review = mongoose.model('Review');

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

// Contact page
const contactPage = (req, res) => {
  res.render('contact', {
    title: 'Contact Us'
  });
};

// Handle contact form submission
const contactSubmit = (req, res) => {
  // Handle contact form logic here
  req.session.message = 'Thank you for your message. We will get back to you soon!';
  res.redirect('/contact');
};

module.exports = {
  homePage,
  aboutPage,
  contactPage,
  contactSubmit
};