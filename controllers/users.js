const User = require('../models/user');

/* GET dashboard page */
exports.getDashboard = (req, res, next) => {
  res.render('dashboard', {
    title: 'Dashboard',
    session: req.session.passport
  });
}

// Create user
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

// Find user by twitterUid
exports.findUser = (req, res, next) => {
  User.findOne({ twitterUid: req.body.twitterUid })
    .then(user => {
      // do something with user
    })
    .catch(err => {
      console.log(err);
    });
}

// Update user
exports.updateUser = (req, res, next) => {
  const spotlightInvoice = req.body.spotlightInvoice;
  User.findOne( {twitterUid: req.body.twitterUid })
    .then(user => {
      user.services.spotlight = spotlightInvoice;
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

// Delete user
exports.deleteUser = (req, res, next) => {
  User.findOneAndDelete( {twitterUid: req.body.twitterUid })
    .then(result => {
      console.log('Deleted user');
    })
    .catch(err => {
      console.log(err);
    });
}