const express = require('express');
const session = require('express-session');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const spotifyRoutes = require('./routes/spotify');

require('dotenv').config();

/* Initialize express app. */
const app = express();
/* Configure database. */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
/* Configure passport. */
require('./backend/passport')(passport);

/* View engine setup. */
app.set('views', path.join(__dirname, 'views'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, '../frontend/public')));

/* Passport session setup. */
app.use(session({
  secret: 'Their secret will go here.',
  saveUninitialized: true,
  resave: true
}));

/* Passport middleware setup. */
app.use(passport.initialize());
app.use(passport.session());

/* Routes setup. */
const auth = express.Router();
authRoutes(auth, passport);
app.use('/auth', auth);

const spotify = express.Router();
spotifyRoutes(spotify);
app.use('/spotify', spotify);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err.message);
});

module.exports = app;
