/* Fetches current user's playlist. */
const request = require('superagent');
const { Buffer } = require('buffer');

global.Buffer = global.Buffer || Buffer;


if (typeof btoa === 'undefined') {
  global.btoa = str => Buffer.from(str).toString('base64');
}

/* Updates token for the given user. */
const updateToken = user => new Promise((resolve, reject) => {
  if (Date.now() > user.expires.getTime()) {
    const encryptedSecret = global.btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
    const reqHeader = `Basic ${encryptedSecret}`;
    const parameters = {
      grant_type: 'refresh_token',
      refresh_token: user.refreshToken
    };
    request.post('https://accounts.spotify.com/api/token')
      .type('form')
      .set('Authorization', reqHeader)
      .send(parameters)
      .then(
        (data) => {
          const newExpiration = new Date();
          newExpiration.setHours(newExpiration.getHours() + 1);
          user.expires = newExpiration;
          user.token = data.body.access_token;
          user.save((error) => {
            if (error) {
              reject(new Error('Could not update token.'));
            } else {
              resolve(user);
            }
          });
          resolve(user);
        },
        error => reject(error)
      )
      .catch((error) => {
        reject(error);
      });
  } else {
    resolve(user);
  }
});

module.exports = {
  updateToken
};
