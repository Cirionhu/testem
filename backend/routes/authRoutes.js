const express = require('express');
const passport = require('../config/passport');

const router = express.Router();

// GOOGLE
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:5173/auth-success',
failureRedirect: 'http://localhost:5173/login',
  })
);

// FACEBOOK
router.get('/facebook',
  passport.authenticate('facebook')
);

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: 'http://localhost:5173/profile',
    failureRedirect: 'http://localhost:5173/login'
  })
);

module.exports = router;