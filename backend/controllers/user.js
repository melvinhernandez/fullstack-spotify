/* User Controller */
const User = require('../models/user');
const { updateToken } = require('./spotify');

/* Returns a new created user. */
const createUser = (profile, accessToken, refreshToken) => {
  const newUser = new User({
    username: profile.username,
    name: profile.displayName,
    url: profile.profileUrl,
    spotifyID: profile.id
  });
  newUser.token = accessToken;
  newUser.refreshToken = refreshToken;
  const expDate = new Date();
  expDate.setTime(expDate.getTime() + (60 * 60 * 1000));
  newUser.expires = expDate;
  return newUser;
};

/* Returns spotify user as a promise. */
const authorizeSpotify = (profile, accessToken, refreshToken) =>
  new Promise((resolve, reject) => {
    User.findOne({ username: profile.username }, (error, user) => {
      if (error) {
        reject(error);
      } else if (user) {
        if (Date.now() >= user.expires) {
          updateToken(user).then(
            updatedUser => resolve(updatedUser),
            updateError => reject(updateError)
          ).catch(updateError => reject(updateError));
        } else {
          resolve(user);
        }
      } else {
        const newUser = createUser(profile, accessToken, refreshToken);
        newUser.save((saveUserError) => {
          if (saveUserError) {
            reject(saveUserError);
          } else {
            resolve(newUser);
          }
        });
      }
    });
  });

module.exports = {
  authorizeSpotify
};
