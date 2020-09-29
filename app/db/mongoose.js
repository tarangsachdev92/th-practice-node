const mongoose = require('mongoose');
// const User = require('../models/user');

console.log(process.env.MONGODB_URL)
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true, // this means when mongoose works with mongoDb our indexes are create allowing us
  // to qucikly access the data we need to access
  useFindAndModify: false, // to remove depricated warning DeprecationWarning: collection.findAndModify is deprecated.
  // Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead. -> 93 lecture 17:45 min.
});

// const me = new User({
//   name: ' smartyTarang   ',
//   email: '  smarttarang@gmail.com ',
// });

// me.save()
//   .then(() => {
//     console.log(me);
//   })
//   .catch((error) => {
//     console.log('Error!', error);
//   });
