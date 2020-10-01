const mongoose = require('mongoose');

const userVerificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // model name same in user.model
  },
  authToken: {
    type: String,
    required: true,
    trim: true
  },
  tokenCreationTime: {
    type: Date
  },
  tokenExpiry: {
    type: Date
  }
});

const User = mongoose.model('UserVerification', userVerificationSchema);

module.exports = User;
