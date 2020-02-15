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
    message: "Welcome to LNBook API.",
    methods: {
      "/api/[twitter screen_name]": "Returns a list of services and LNURLs for that user.",
      "/api/getInvoice/[twitter screen_name]": "Returns invoices for services for that user"
    },
    note: "Do NOT include the '@' in queries. Response will contain a 10-digit Twitter UID. This is constant; @names can change."
  });
}

exports.getUserByName = (req, res, next) => {
  client.get('users/show', { screen_name: req.params.screen_name })
    .then(tweet => {
      // Remove Mongodb _id fields for presentation
      User.findOne({ twitterUid: tweet.id_str },'-_id -services._id')
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
      res.json({
        errors: err
      });
    });
}

exports.getInvoiceByName = async (req, res, next) => {
  client.get('users/show', { screen_name: req.params.screen_name })
  .then(tweet => {
    this.addInvoice(tweet.screen_name, invoice => {
      User.findOne({ twitterUid: tweet.id_str },'-_id -services._id')
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
    })
  })
  .catch(err => {
    console.log(err);
    res.json({
    errors: err
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

exports.addInvoice = (screen_name, _callback) => {
  request.get({ url: 'https://api.tippin.me/v1/public/addinvoice/' + screen_name, }, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      let data = JSON.parse(body);
      if(data['error']){
        console.log(data['message']);
        _callback(false);
      }else{
        _callback(invoice = data['lnreq']);
      }
    }else{
      _callback(false);
    }
  })
}
