const express = require('express');
const passport = require('passport');
const router = express.Router();
const googleController = require('../controllers/google');

// Đăng nhập bằng Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback sau khi người dùng đăng nhập thành công với Google
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  googleController.googleLoginCallback
);

module.exports = router;
