const express = require('express');
const passport = require('passport');
const googleRoutes = express.Router();
const googleController = require('../controllers/google');

googleRoutes.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: "select_account" 
}));

googleRoutes.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  googleController.googleLoginCallback
);

module.exports = googleRoutes;
