const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true, // this means when mongoose works with mongoDb our indexes are create allowing us
  // to quickly access the data we need to access
  useFindAndModify: false // to remove deprecated warning DeprecationWarning: collection.findAndModify is deprecated.
  // Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead
});

module.exports = mongoose.connection;
