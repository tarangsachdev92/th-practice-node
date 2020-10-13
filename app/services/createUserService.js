const { sendWelcomeEmail } = require('../emails/account');
const User = require('../models/users');

class UserCreationService {
  static async call (dataParams) {
    const { firstName, lastName, email, dob } = dataParams;
    const user = new User({ firstName, lastName, email, dob });
    await user.save();
    sendWelcomeEmail(user.email, user.firstName);
    return user;
  }
}

module.exports = UserCreationService;
