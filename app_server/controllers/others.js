const mongoose = require('mongoose');
const User = mongoose.model('User');

const loginPage = (req, res) => {
  res.render('login', {
    title: 'Login - Space Crafters'
  });
};

const loginSubmit = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await user.comparePassword(password))) {
      return res.render('login', {
        title: 'Login - Space Crafters',
        error: 'Invalid email or password',
        formData: { email }
      });
    }

    req.session.user = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    };

    res.redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', {
      title: 'Login - Space Crafters',
      error: 'Login failed. Please try again.',
      formData: req.body
    });
  }
};

const registerPage = (req, res) => {
  res.render('register', {
    title: 'Register - Space Crafters'
  });
};

const registerSubmit = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, phone } = req.body;

    if (password !== confirmPassword) {
      return res.render('register', {
        title: 'Register - Space Crafters',
        error: 'Passwords do not match',
        formData: req.body
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.render('register', {
        title: 'Register - Space Crafters',
        error: 'User already exists with this email',
        formData: req.body
      });
    }

    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phone
    });

    await user.save();

    req.session.user = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    };

    res.redirect('/');
  } catch (error) {
    console.error('Registration error:', error);
    res.render('register', {
      title: 'Register - Space Crafters',
      error: 'Registration failed. Please try again.',
      formData: req.body
    });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
};

module.exports = {
  loginPage,
  loginSubmit,
  registerPage,
  registerSubmit,
  logout
};