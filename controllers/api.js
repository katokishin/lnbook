const User = require('../models/user');
// Connect to Twitter API
const Twitter = require('twitter');
const creds = require('../creds');
const client = new Twitter({
  consumer_key: creds.twitter.key,
  consumer_secret: creds.twitter.secret,
  bearer_token: creds.twitter.bearer
});

const request = require('request');

exports.getHelp = (req, res, next) => {
  res.json({
    message: "Welcome to LNBook API. We currently have only 1 method.",
    method: "/api/[twitter_profile.id] will return a list of services and invoices for that user on record with us.",
    note: "Twitter profile ID not to be confused with @username or Screen Name."
  });
}

exports.getUid = (req, res, next) => {
  // Remove Mongodb _id fields for presentation
  User.findOne({ twitterUid: req.params.uid },'-_id -services._id')
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

exports.getInvoice = async (req, res, next) => {
  var tweet;
  try{
    tweet = await client.get('users/show', { user_id: req.params.uid });
  }catch(err){
    console.log(err);
    res.json({
    errors: err
    });
  }
  const invoice = await this.addInvoice(tweet.screen_name);
  User.findOne({ twitterUid: req.params.uid },'-_id -services._id')
    .then(user => {
      console.log(user)
      if(user !== null){
        res.json({
        user_id: user.twitterUid,
        services: user.services,
        invoices: [{
          name: "Tippin.me",
          invoice: invoice}]
        });
      } else {
        res.json({
        errors: [{
          code: "100",
          message: "Sorry, that user does not exist"}]
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.json({
      errors: [{
        code: "101",
        message: "Sorry, something went wrong"}]
      });
    });
  // Save invoice
  /**
  if(invoice){
    User.findOne( {twitterUid: req.params.uid })
      .then(user => {
        user.services.push({ name: 'Tippin.me', invoice: invoice });
        user.save()
        .then(user => {
          User.findOne({ twitterUid: req.params.uid },'-_id -services._id')
            .then(user => {
              res.json({
              user_id: user.twitterUid,
              services: user.services
              });
            })
            .catch(err => {
              console.log(err);
            })
        })
        .catch(err => {
          console.log(err);
        })
      })
      .catch(err => {
        console.log(err);
      });
  }else{
    res.json({
      error: true,
    });
  }**/
}

exports.addInvoice = function(screen_name){
  return new Promise(function (cb) {
    var options = {
      url: 'https://api.tippin.me/v1/public/addinvoice/' + screen_name,
    };
    request.get(options, function (err, response, body) {
      if (!err && response.statusCode == 200) {
        var data = JSON.parse(body);
        if(data['error']){
          console.log(data['message']);
          cb(false);
        }else{
          cb(invoice = data['lnreq']);
        }
      }else{
        cb(false);
      }
    });
  });
};
