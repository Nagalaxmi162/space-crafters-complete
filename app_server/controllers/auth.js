const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');

module.exports.loginGet = (req, res) => {
  res.render('login', { title: 'Login' });
};

module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', { 
        title: 'Login',
        error: 'User not found' 
      });
    }

    // Compare password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { 
        title: 'Login',
        error: 'Invalid password' 
      });
    }

    // Set session
    req.session.user = {
      id: user._id,
      email: user.email
    };
    res.redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { 
      title: 'Login',
      error: 'Login failed. Please try again.' 
    });
  }
};

module.exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};
 
