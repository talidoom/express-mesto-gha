const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};
const User = require('../models/User');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(STATUS_CODES.OK).send({ users }))
    .catch(next);
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_CODES.CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({ message: err.message });
      } else {
        console.error(err.message);
        res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(STATUS_CODES.OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'NotValidId') {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Такого пользователя нет' });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('NotUser'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotUser') return res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
      return next(err);
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(STATUS_CODES.OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Такого пользователя нет' });
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(STATUS_CODES.OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Такого пользователя нет' });
      }
      return next(err);
    });
};
