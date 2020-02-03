const User = require('../models/user');

exports.getHelp = (req, res, next) => {
  res.json({
    message: "Welcome to LNBook API. We currently have only 1 method.",
    method: "/api/[twitter_profile.id] will return a list of services and invoices for that user on record with us.",
    note: "Twitter profile ID not to be confused with @username or Screen Name."
  });
}

exports.getUid = (req, res, next) => {
  User.findOne({ twitterUid: req.params.uid })
    .then(user => { 
      res.json({
      user_id: user.twitterUid,
      services: user.services
      });
    })
    .catch(err => {
      console.log(err);
    });
}