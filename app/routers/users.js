const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const { sendWelcomeEmail, generateLoginLink } = require('../emails/account');

router.post('/createUser', async (req, res) => {
  const user = new User(req.body);
  try {
    user.save();
    sendWelcomeEmail(user.email, user.first_name);
    res.status(201).send({ user });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/authenticateUser', async (req, res) => {
  const email = req.query.email || '';
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send();
    }
    console.log(user);
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/usersList', async (req, res) => {
  try {
    const users = await User.find({});
    console.log(users);
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login', async (req, res) => {
  const email = req.body.email;
  generateLoginLink(email);
  res.status(200).send({ email });
});

router.patch('/updateUser/:id', async (req, res) => {
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
});

module.exports = router;
