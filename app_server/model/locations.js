const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

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
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: String,
  projectType: {
    type: String,
    required: true,
    enum: ['Residential Design', 'Commercial Design', 'Consultation Only', 'Other']
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    required: true
  },
  recommendation: {
    type: String,
    required: true,
    enum: ['Yes', 'Maybe', 'No']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

mongoose.model('User', userSchema);
mongoose.model('Project', projectSchema);
mongoose.model('Review', reviewSchema);