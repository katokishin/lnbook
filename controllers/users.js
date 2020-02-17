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

/* GET dashboard page */
exports.getDashboard = (req, res, next) => {
  User.findOne({ twitterUid: req.session.passport.user.twitterUid })
  .then(user => { 
    res.render('dashboard', {
      title: 'Dashboard',
      session: req.session.passport,
      user: user
    });
  })
  .catch(err => {
    console.log(err);
  });
}

/* GET user page */
exports.getUserPage = (req, res, next) => {
  client.get('users/show', { screen_name: req.params.screen_name })
    .then(tweet => {
      User.findOrCreate({ twitterUid: tweet.id_str }, user => {
        apiController.addInvoice(req.params.screen_name, invoice => {
          res.render('user', {
            title: 'User: '+ tweet.screen_name,
            session: req.session.passport,
            tweet: tweet,
            user: user,
            invoice: invoice
          });
        })
      })
    })
    .catch(err => {
      // Includes case where there is no such Twitter profile
      console.log(err);
      res.redirect('/');
    });
}

// Create user
/*
exports.createUser = (req, res, next) => {
  const twitterUid = 123456789;
  const user = new User({ twitterUid: twitterUid });
  user.save()
    .then(result => {
      console.log('User created');
    })
    .catch(err => {
      console.log(err);
    });
}
*/

// Load all users
/* 
exports.allUsers = (req, res, next) => {
  User.find()
    .then(users => {
      console.log(users);
      res.render('users/list', {
        users: users,
        title: 'All Users',
        path: '/users'
      });
    })
    .catch(err => {
      console.log(err);
    });
} 
*/

// Update user
/*
exports.updateUser = (req, res, next) => {
  const spotlightInvoice = req.body.spotlightInvoice;
  User.findOne( {twitterUid: req.body.twitterUid })
    .then(user => {
      // update user
      return user.save();
    })
    .then(result => {
      console.log('Updated user');
      // other stuff like redirects
    })
    .catch(err => {
      console.log(err);
    });
}
*/

exports.postAddLapp = (req, res, next) => {
  const service = req.body.service;
  const lnurl = req.body.lnurl;
  User.findOne( {twitterUid: req.session.passport.user.twitterUid })
    .then(user => {
      user.services.push({ name: service, lnurl: lnurl });
      return user.save();
    })
    .then(result => {
      console.log('Updated user');
      // other stuff like redirects
      res.redirect('/users/dashboard');
    })
    .catch(err => {
      console.log(err);
    });
}

exports.postRemoveLapp = (req, res, next) => {
  const service_id = req.body.service_id;
  User.findOneAndUpdate( { twitterUid: req.session.passport.user.twitterUid }, { $pull: { services : { _id : service_id } } })
  .then(user => {
    console.log(user);
    return user.save();
  })
  .then(result => {
    console.log('Removed lapp');
    // other stuff like redirects
    res.redirect('/users/dashboard');
  })
  .catch(err => {
    console.log(err);
  });
}

// Delete user
/*
exports.deleteUser = (req, res, next) => {
  User.findOneAndDelete( {twitterUid: req.body.twitterUid })
    .then(result => {
      console.log('Deleted user');
    })
    .catch(err => {
      console.log(err);
    });
}
*/