const { SERVER_ERROR } = require('../utils/constants');

const errorHandler = (err, _, res, next) => {
  const statusCode = err.statusCode || SERVER_ERROR;
  const message = statusCode === SERVER_ERROR ? 'На сервере произошла ошибка' : err.message;

  res.status(statusCode).send({ message });

  next();
};

module.exports = errorHandler;
