const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const slugify = require('../utils/slugify');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    const googleId = profile.id;
    const name = profile.displayName;
    const avatarUrl = profile.photos?.[0]?.value;
    if (!googleId) return done(new Error('Không lấy được Google ID'));
    if (!name) return done(new Error('Không lấy được tên từ Google'));
    if (!email) return done(new Error('Không lấy được email từ Google'));

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      let slug = slugify(name);
      let slugExists = await User.findOne({ slug });
      if (slugExists) slug += '-' + Date.now();

      user = new User({
        name,
        email,
        googleId,
        avatarUrl,
        slug,
        provider: 'google'
      });
      await user.save();
    } else {
      if (!user.googleId) user.googleId = googleId;
      if (!user.avatarUrl) user.avatarUrl = avatarUrl;
      await user.save();
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
