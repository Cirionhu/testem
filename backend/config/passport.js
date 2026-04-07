const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const { User } = require('../models');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// GOOGLE
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          where: { google_id: profile.id },
        });

        if (!user) {
          const email =
            profile.emails?.[0]?.value ||
            `google_${profile.id}@social.local`;

          const name = profile.displayName || 'Google felhasználó';

          // ha már van ugyanilyen emaillel user, azt frissítjük
          const existingByEmail = await User.findOne({
            where: { email },
          });

          if (existingByEmail) {
            await existingByEmail.update({
              google_id: profile.id,
              name: existingByEmail.name || name,
            });

            user = existingByEmail;
          } else {
            user = await User.create({
              name,
              email,
              password: null,
              google_id: profile.id,
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// FACEBOOK
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          where: { facebook_id: profile.id },
        });

        if (!user) {
          const email =
            profile.emails?.[0]?.value ||
            `facebook_${profile.id}@social.local`;

          const name = profile.displayName || 'Facebook felhasználó';

          const existingByEmail = await User.findOne({
            where: { email },
          });

          if (existingByEmail) {
            await existingByEmail.update({
              facebook_id: profile.id,
              name: existingByEmail.name || name,
            });

            user = existingByEmail;
          } else {
            user = await User.create({
              name,
              email,
              password: null,
              facebook_id: profile.id,
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;