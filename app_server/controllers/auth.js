const mongoose = require('mongoose');
const User = mongoose.model('User');

const loginGet = (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('login', { error: null });
};

const loginPost = async (req, res) => {
  try {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Form data:', req.body);
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('ERROR: Missing fields');
      return res.render('login', { error: 'All fields are required' });
    }

    // Find user by email only - NO PASSWORD MATCHING
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    
    console.log('User found:', user ? 'YES ✅' : 'NO ❌');
    
    if (!user) {
      console.log('ERROR: User not found');
      return res.render('login', { error: 'User not found' });
    }

    // AUTO LOGIN - NO PASSWORD CHECK
    console.log('✅ AUTO LOGIN SUCCESSFUL - PASSWORD SKIPPED');
    
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email
    };

    console.log('Session created:', req.session.user);
    res.redirect('/');

  } catch (err) {
    console.error('❌ LOGIN ERROR:', err);
    res.render('login', { error: 'Login failed: ' + err.message });
  }
};

const logout = (req, res) => {
  console.log('=== LOGOUT ===');
  req.session.destroy(() => {
    console.log('Session destroyed');
    res.redirect('/login');
  });
};

module.exports = {
  loginGet,
  loginPost,
  logout
};
