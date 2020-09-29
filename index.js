const express = require('express');
require('./app/db/mongoose');
const usersRouter = require('./app/routers/users');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(usersRouter);

app.listen(port, () => {
  console.log('the server is up on ' + port);
});
