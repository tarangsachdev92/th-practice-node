const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    // required: true,
    trim: true,
  },
  last_name: {
    type: String,
    // required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
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
    // required: true,
  },
});

// userSchema.methods.generateToken = async function () {
//   const user = this;
//   const token = new ObjectID();
//   user.token = token
//   await user.save();
//   return token;
// };

const User = mongoose.model('User', userSchema);

module.exports = User;
