/* Configuring our passport settings. */
const User = require('./models/user');
const { Strategy } = require('passport-spotify');
const { authorizeSpotify } = require('./controllers/user');

const passportConfiguration = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      done(error, user);
    });
  });
  console.log(process.env.CLIENT_ID);
  /* Passport-Spotify strategy for OAuth. */
  passport.use(new Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        authorizeSpotify(profile, accessToken, refreshToken)
          .then(
            user => done(null, user),
            error => done(error)
          ).catch(authorizeError => done(authorizeError));
      });
    }
  ));
};

module.exports = passportConfiguration;
