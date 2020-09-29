const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is Invalid');
      }
    },
  },
  dob: {
    type: String,
    required: true,
  },
});

module.exports = User;
