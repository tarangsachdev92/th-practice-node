const User = require('../models/users');
const UserVerification = require('../models/user-verification');
const { sendWelcomeEmail, generateLoginLink } = require('../emails/account');
const mongoose = require('mongoose');

const userController = {
  createUser: async (req, res) => {
    // validate joi validator

    const Joi = require('joi');
    const data = req.body;

    const schema = Joi.object({
      email: Joi.string().email().required(),
      first_name: Joi.string().min(1)
        .max(30),
      last_name: Joi.string().min(1)
        .max(30),
      dob: Joi.date()
    });

    try {
      const value = await schema.validateAsync(data);
      const user = new User(value);
      await user.save();
      sendWelcomeEmail(user.email, user.first_name);
      res.status(201).send({ user });
    } catch (err) {
      res.status(422).json({
        status: 'error',
        message: err.message,
        data: err.data
      });
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
      return res.status(404).send({ error: 'Invalidate updates' });
    }
    const _id = req.params.id;
    try {
      const user = await User.findByIdAndUpdate(_id, req.body, {
        new: true, // return updated value
        runValidators: true // do run validation on updates
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
      const authToken = new mongoose.Types.ObjectId();
      const tokenCreationTime = new Date();
      const tokenExpiry = new Date();

      tokenExpiry.setMinutes(tokenCreationTime.getMinutes() + 5);

      const userId = userExist ? userExist._id : user._id;

      const userVerification = new UserVerification({
        authToken,
        tokenExpiry,
        tokenCreationTime,
        user: userId
      });

      await UserVerification.deleteMany({ user: userId });

      await userVerification.save();

      // send email
      generateLoginLink(email, authToken);

      res.status(200).send({ email, authToken });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },

  authorize: async (req, res) => {
    const email = req.query.email || '';
    const authToken = req.query.authToken || '';

    console.log(email);
    try {
      // check if email id exists
      console.log(email);
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
      // check for userVerification
      const userVerification = await UserVerification.findOne({ authToken });
      if (!userVerification) {
        return res.status(404).send({ error: 'Not Found!,Please login again' });
      }

      const currentDateTime = new Date();
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
  }
};

module.exports = userController;
