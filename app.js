const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');

const app = express();

// Connect to database
mongoose.connect('mongodb://127.0.0.1:27017/lnbook', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('Database connection established');
  })
  .catch(err => {
    console.log(err);
  });

// Sessions, stored in MongoDB for security and scalability
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: 'use a sufficiently long and random secret for security',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Twitter login
const passport = require('passport');
const passportTwitter = require('passport-twitter');
const creds = require('./creds');
const User = require('./models/user');

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
passport.use(new passportTwitter.Strategy({
  consumerKey: creds.twitter.key,
  consumerSecret: creds.twitter.secret,
  callbackURL: "http://127.0.0.1:3000/auth/twitter/callback",
  // includeEmail: true
},
  function(token, tokenSecret, profile, cb) {
    User.findOne( { twitterUid: profile.id }, (err, user) => {
      if (user === null) {
        newUser = new User({ twitterUid: profile.id, services: {} });
        newUser.save();
        return cb(err, newUser);
      } else {
        return cb(err, user);
      }
    });
  }
));

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication
    res.redirect('/');
  });


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
