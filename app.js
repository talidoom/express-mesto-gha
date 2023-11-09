const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(MONGO_URL);

mongoose
  .connect(MONGO_URL)
  .then(() => console.log('БД подключена'))
  .catch((err) => console.log('Ошбика подключения к БД', err));

app.use((req, res, next) => {
  req.user = {
    _id: '654ca4bfe95301df12af9088',
  };
  next();
});

app.use(bodyParser.json());
app.use('/', userRouter);
app.use('/', cardRouter);

app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
