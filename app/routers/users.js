const express = require('express');
const router = new express.Router();
const userController = require('../controllers/users');

router.post('/createUser', userController.createUser);

router.get('/authenticateUser', userController.authenticateUser);

router.get('/usersList', userController.usersList);

router.post('/login', userController.login);

router.patch('/updateUser/:id', userController.updateUser);

module.exports = router;
