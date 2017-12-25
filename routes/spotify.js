/* ROUTES: Spotify API handler. */
const spotify = (router, passport) => {
  router.get('/', (req, res, next) => {
    res.json('Soon come.');
  });
};

module.exports = spotify;
