const User = require('../models/user');
const apiController = require('../controllers/api');

// Connect to Twitter API
const Twitter = require('twitter');
const creds = require('../creds');
const client = new Twitter({
  consumer_key: creds.twitter.key,
  consumer_secret: creds.twitter.secret,
  bearer_token: creds.twitter.bearer
});

// Takes @name and creates entry in DB if none exists for user
// Returns DB entry and tweet object for that user to _callback
exports.findOrCreateUser = (screen_name, _callback) => {
  client.get('users/show', { screen_name: screen_name })
    .then(tweet => {
      User.findOne({ twitterUid: tweet.id_str })
        .then(user => {
          console.log(user);
          if (user !== null) {
            // If user exists in DB
            return _callback(user, tweet);
          } else {
            // If not, requests tippin and saves into db
            const r = apiController.addInvoice(screen_name);
            if(r){
              newUser = new User({ twitterUid: tweet.id_str, services: {} });
              newUser.save()
              .then(user => {
                console.log("new user saved");
                User.findOne({ twitterUid: tweet.id_str })
                  .then(user => {
                    if (user !== null) {
                      return _callback(user, tweet);
                    } else {
                      throw 'user is null';
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  });
              })
              .catch(err => {
                console.log(err);
              });
            }else{
              console.log("r is false");
              res.redirect('/');
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
      })
      .catch(err => {
        // Includes case where there is no such user
        console.log(err);
      });
}