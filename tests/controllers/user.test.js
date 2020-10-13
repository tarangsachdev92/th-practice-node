/* eslint-disable no-undef */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../app/models/users');

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  firstName: 'Mike',
  lastName: 'Rose',
  email: 'mikerose@gmail.com',
  dob: new Date('04-jan-1962')
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test('should create a user', async () => {
  const response = await request(app).post('/users/createUser').send({
    firstName: 'Tarang',
    lastName: 'Sachdev',
    email: 'tarangsachdev@gmail.com',
    dob: new Date('19-dec-1992')
  }).expect(201);

  const user = await User.findById(response.body._id);

  expect(user).not.toBeNull();

  // about the response
  expect(response.body).toMatchObject({
    firstName: 'Tarang'
  });
});

test('should login', async () => {
  await request(app).post('/users/login').send({
    email: 'tarangsachdev@gmail.com'
  }).expect(200);
});

test('should login', async () => {
  const response = await request(app).post('/users/login').send({
    email: 'tarangsachdev@gmail.com'
  }).expect(200);
});
