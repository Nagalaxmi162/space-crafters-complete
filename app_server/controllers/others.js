const mongoose = require('mongoose');
require('../models/locations');

const Review = mongoose.model('Review');
const reviewsList = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .sort({ createdAt: -1 })
      .limit(10);

    res.render('reviews', {
      reviews: reviews || [],
      currentPage: 1,
      totalPages: 1
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).send('Error loading reviews: ' + err.message);
  }
};
// Review form GET handler
const reviewsCreate = (req, res) => {
  res.render('review-form');
};

// Review form POST handler
const reviewsCreatePost = async (req, res) => {
  try {
    console.log('Review form data received:', req.body);
    const { name, email, rating, projectType, reviewText } = req.body;

    // Create Review
    const newReview = new Review({
      name,
      email,
      rating: parseInt(rating),
      projectType,
      reviewText,
      status: 'pending'
    });

    await newReview.save();
    console.log('Review saved successfully');

    res.render('thank-you', {
      message: 'Thank you for your review!',
      returnUrl: '/reviews',
      returnText: 'View All Reviews'
    });

  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).send('Error submitting review. Please try again.');
  }
};

module.exports = {
  reviewsCreate,
  reviewsCreatePost,
  reviewsList
};