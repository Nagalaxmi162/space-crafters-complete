const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({ 
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  username: {
    type: String,
    sparse: true  // Allow null values but enforce unique when present
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

 // Project Schema
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Office', 'Balcony', 'Dining Room', 'Other']
  },
  images: [{
    filename: String,
    originalName: String,
    path: String
  }],
  tags: [String],
  location: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  budget: {
    min: Number,
    max: Number
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  projectType: String,
  reviewText: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  createdAt: { type: Date, default: Date.now }
});
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  subject: String,
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  createdAt: { type: Date, default: Date.now }
});

mongoose.model('Contact', contactSchema);
mongoose.model('User', userSchema);
mongoose.model('Project', projectSchema);
mongoose.model('Review', reviewSchema);
module.exports = {
  Contact: mongoose.model('Contact'),
  Review: mongoose.model('Review'),
  Project: mongoose.model('Project'),
  User:mongoose.model('User')
};