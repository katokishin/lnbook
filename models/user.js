// User data model
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  twitterUid: {
    type: String,
    required: true
  },
  services: [{ name: String, lnurl: String }]
});

userSchema.statics.findOrCreate = ({ twitterUid: twitterUid }, _callback) => {
  User.findOne({ twitterUid: twitterUid },'-_id -services._id')
      .then(user => { 
        // If user found
        if (user) {
          return _callback(user);
        }
        // If user not in DB
        const newUser = new User({twitterUid: twitterUid, services: []});
        console.log("Saving new user " + newUser);
        newUser.save(_callback(newUser));
      })
      .catch(err => {
        // If error
        console.log(err);
        _callback(err);
      });
}

// Mongoose will automatically put this in collection "users"
const User = mongoose.model('User', userSchema);
module.exports = User;


