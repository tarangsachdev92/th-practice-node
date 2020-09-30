const User = require('../models/users');
const UserVerification = require('../models/user-verification');
const { sendWelcomeEmail, generateLoginLink } = require('../emails/account');
const { ObjectID } = require('mongodb');

const userController = {
  createUser: async (req, res) => {
    const user = new User(req.body);
    try {
      await user.save();
      sendWelcomeEmail(user.email, user.first_name);
      res.status(201).send({ user });
    } catch (error) {
      res.status(400).send(error);
    }
  },

  usersList: async (req, res) => {
    try {
      const users = await User.find({});
      //   console.log(users);
      res.status(200).send(users);
    } catch (error) {
      res.status(400).send(error);
    }
  },

  updateUser: async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ['first_name', 'last_name', 'dob', 'email'];
    const isValidOperation = updates.every((update) =>
      allowUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(404).send({ error: 'Invalide updates' });
    }
    const _id = req.params.id;
    try {
      const user = await User.findByIdAndUpdate(_id, req.body, {
        new: true, // return updated value
        runValidators: true, // do run validation on updates
      });
      if (!user) {
        return res.status(404).send();
      }
      res.send(user); // 200
    } catch (error) {
      res.status(400).send(error);
      // res.status(500).send(error)
    }
  },

  login: async (req, res) => {
    const email = req.body.email;
    try {
      // check if user exist or not
      const userExist = await User.findOne({ email });
      const user = new User(req.body);

      // if not exist we create that user
      if (!userExist) {
        await user.save();
      }

      // assign token to the user and remove entry in verification table

      const authToken = new ObjectID().toHexString();
      const tokenCreationTime = new Date();
      const tokenExpiry = new Date();

      tokenExpiry.setMinutes(tokenCreationTime.getMinutes() + 5);

      const userId = userExist ? userExist._id : user._id;

      const userVerification = new UserVerification({
        authToken,
        tokenExpiry,
        tokenCreationTime,
        user: userId,
      });

      await UserVerification.deleteMany({ user: userId });

      await userVerification.save();

      // send email
      generateLoginLink(email, authToken);

      // here email and authToken is send onlt for development purpose
      res.status(200).send({ email, authToken });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },

  authenticateUser: async (req, res) => {
    const email = req.query.email || '';
    const authToken = req.query.authToken || '';

    console.log(email);
    try {
      // console.log(new RegExp('^' + email + '$'));
      // const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });

      // check if email id exists
      const user = await User.findOne({ email });
      // console.log(user);
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }

      // check for userVerification
      const userVerification = await UserVerification.findOne({
        authToken,
      });

      if (!userVerification) {
        return res.status(404).send({ error: 'Not Found!,Please login again' });
      }

      // check for expiration
      const currentDateTime = new Date();

      // console.log(currentDateTime > userVerification.tokenExpiry);

      // Remove token to restrict logins using same token twice
      await UserVerification.findByIdAndDelete({ _id: userVerification._id });
      if (currentDateTime > userVerification.tokenExpiry) {
        throw new Error('Token Expire!, Please login and you will get email');
      }
      res.status(200).send({ verified: true });
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: error.message });
    }
  },
};

module.exports = userController;
