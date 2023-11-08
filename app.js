const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(MONGO_URL);

mongoose
  .connect(MONGO_URL)
  .then(() => console.log('БД подключена'))
  .catch((err) => console.log('Ошбика подключения к БД', err));

// app.use((req, res, next) => {
//   req.user = {
//     _id: '5d8b8592978f8bd833ca8133', // вставьте сюда _id созданного в предыдущем пункте пользователя
//   };

//   next();
// });

app.use('/', userRouter);
app.use('/', cardRouter);

app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
