const express = require('express');
const mongoose = require('mongoose');
// const router = express.Router();
const app = express();
const users = require('./routes/users');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(MONGO_URL);

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', users);

app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
