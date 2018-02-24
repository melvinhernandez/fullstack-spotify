/* ROUTES: SPOTIFY AUTHENTICATION. */

const auth = (router, passport) => {
  /* Authenticate Spotify with Passport. */
  router.get(
    '/spotify',
    passport.authenticate('spotify', { scope: ['playlist-modify-public'] }),
    () => {
      /* This function is not called. */
    }
  );
  /* Handle after authentication. */
  router.get(
    '/spotify/callback',
    passport.authenticate('spotify', {
      successRedirect: 'http://localhost:3000',
      failureRedirect: 'http://localhost:5000/auth/spotify'
    })
  );

  /* Logout. */
  router.get(
    '/logout',
    (req, res) => {
      req.logout();
      res.redirect('back');
    }
  );

  /* Get current user. */
  router.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.json(null);
    }
  });
};

module.exports = auth;
