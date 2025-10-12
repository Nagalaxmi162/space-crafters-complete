const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const Review = mongoose.model('Review');

const categories = [
  'All', 'Living Room', 'Kitchen', 'Bedroom', 
  'Bathroom', 'Office', 'Balcony', 'Dining Room', 'Other'
];

const projectsList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;
    let filter = { status: 'published' };

    // Category filter (case-insensitive, supports "All")
    if (req.query.category && req.query.category.toLowerCase() !== 'all') {
      filter.category = { $regex: `^${req.query.category}$`, $options: 'i' };
    }

    // Flexible search in title, description, location
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { location: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProjects = await Project.countDocuments(filter);
    const totalPages = Math.ceil(totalProjects / limit);

    res.render('projects', {
      title: 'Our Projects - Space Crafters',
      projects,
      categories,
      currentPage: page,
      totalPages,
      currentCategory: req.query.category || 'All',
      searchQuery: req.query.search || ''
    });
  } catch (error) {
    console.error('Projects list error:', error);
    res.status(500).render('error', { 
      message: 'Server Error',
      error: req.app.get('env') === 'development' ? error : {}
    });
  }
};

// Route handler for /projects/category/:category
const projectsByCategory = async (req, res) => {
  try {
    const selectedCategory = req.params.category;
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    let filter = { status: 'published' };
    if (selectedCategory && selectedCategory.toLowerCase() !== 'all') {
      filter.category = { $regex: `^${selectedCategory}$`, $options: 'i' };
    }

    const projects = await Project.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProjects = await Project.countDocuments(filter);
    const totalPages = Math.ceil(totalProjects / limit);

    res.render('projects', {
      title: selectedCategory + ' Projects - Space Crafters',
      projects,
      categories,
      currentPage: page,
      totalPages,
      currentCategory: selectedCategory,
      searchQuery: ''
    });
  } catch (error) {
    console.error('Projects by category error:', error);
    res.status(500).render('error', { 
      message: 'Server Error',
      error: req.app.get('env') === 'development' ? error : {}
    });
  }
};

// Other project and review handlers...
const projectDetail = async (req, res) => { /* unchanged */ };
const reviewsList = async (req, res) => { /* unchanged */ };
const reviewForm = (req, res) => { /* unchanged */ };
const reviewSubmit = async (req, res) => { /* unchanged */ };

module.exports = {
  projectsList,
  projectsByCategory,
  projectDetail,
  reviewsList,
  reviewForm,
  reviewSubmit
};


