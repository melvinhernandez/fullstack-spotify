const axios = require('axios');
const _ = require('lodash');

/** Spotify API request methods. */
const searchArtist = (q, token) => {
  console.log('searching');
  return axios.get('https://api.spotify.com/v1/search', {
    params: {
      q,
      type: 'artist'
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};


/** Spotify API create playlist. */
const createPlaylist = (artists, userID, token) => {
  return axios.post(`https://api.spotify.com/v1/users/${userID}/playlists`, {
    name: 'Favorite Top Songs',
    description: `A playlist with top tracks from ${artists.join(', ')}.`
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

/** Spotify API get artist top tracks */
const getTracks = (artists, token) => {
  const promises = artists.map(id =>
    axios.get(`https://api.spotify.com/v1/artists/${id}/top-tracks?country=US`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }));
  return Promise.all(promises);
};

/** Spotify API add tracks to a playlist. */
const findTopTracks = (artistIDs, playlistID, userID, token) => {
  getTracks(artistIDs, token)
    .then(
      (topTracksRes) => {
        let tracks = _.flatten(topTracksRes.map(res => res.data.tracks));
        tracks = tracks.map(track => track.uri);
        return pushTracks(tracks, playlistID, userID, token);
      },
      (topTracksError) => {
        console.log(topTracksError);
        return topTracksError;
      }
    )
    .catch((topTracksCallError) => {
      console.log(topTracksCallError);
      return topTracksCallError;
    });
};

/** Spotify API to post tracks to a playlist. */
const pushTracks = (tracks, playlistID, userID, token) => {
  console.log('pushing tracks');
  return axios.post(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
    uris: tracks
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

/* ROUTES: Spotify API handler. */
const spotify = (router) => {
  router.get('/search', (req, res) => {
    searchArtist(req.query.q, req.user.token)
      .then(
        (artistResults) => {
          console.log(artistResults);
          res.send(artistResults.data.artists);
        },
        (error) => {
          console.log(error);
          res.send(error);
        }
      )
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  });

  router.get('/createPlaylist', (req, res) => {
    console.log('params:', req.query);
    createPlaylist(req.query.artists, req.user.spotifyID, req.user.token)
      .then(
        (resp) => {
          res.send(resp.data);
        },
        (error) => {
          console.log(error);
          res.send(error);
        }
      ).catch((error) => {
        console.log(error);
        res.send(error);
      });
  });

  router.get('/addTracks', (req, res) => {
    const { artistIDs, playlistID } = req.query;
    const { spotifyID, token } = req.user;
    getTracks(artistIDs, token)
      .then(
        (tracksRes) => {
          let tracks = _.flatten(tracksRes.map(tRes => tRes.data.tracks));
          tracks = tracks.map(track => track.uri);
          res.send(pushTracks(tracks, playlistID, spotifyID, token));
        },
        (topTracksError) => {
          console.log(topTracksError);
          res.send(topTracksError);
        }
      )
      .catch((topTracksCallError) => {
        console.log(topTracksCallError);
        res.send(topTracksCallError);
      });
  });
};

module.exports = spotify;
