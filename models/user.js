// User data model
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  twitterUid: {
    type: String,
    required: true
  },
  services: {
    tippin: String,
    spotlight: String,
    bluewallet: String,
    lntxbot: String,
    walletofsatoshi: String,
    // more services can be added later
  }
});

// Mongoose will automatically put this in collection "users"
const User = mongoose.model('User', userSchema);
module.exports = User;


