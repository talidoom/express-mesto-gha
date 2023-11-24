const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');
const User = require('../models/User');

const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const { HTTP_CREATED_CODE } = require('../utils/constants');

function login(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      if (userId) {
        const token = jwt.sign({ userId }, JWT_SECRET, {
          expiresIn: '7d',
        });
        return res.send({ _id: token });
      }
      throw new UnauthorizedError('Передан неверный логин или пароль');
    })
    .catch(next);
}

function createUser(req, res, next) {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const { _id } = user;
      return res.status(HTTP_CREATED_CODE).send({
        email,
        name,
        about,
        avatar,
        _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new ConflictError(
            'При регистрации указан email, который уже существует на сервере',
          ),
        );
      } else if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Передача некорректных данных',
          ),
        );
      } else {
        next(err);
      }
    });
}

function getUsersInfo(_, res, next) {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
}

function getUserById(req, res, next) {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (user) return res.send({ user });
      throw new NotFoundError('Пользователь c указанным ID не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передача некорректного ID'));
      } else {
        next(err);
      }
    });
}

function getUserInfo(req, res, next) {
  const { userId } = req.user;
  User.findById(userId)
    .then((user) => {
      if (user) return res.send({ user });
      throw new NotFoundError('Пользователь c указанным ID не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передача некорректного ID'));
      } else {
        next(err);
      }
    });
}

function updateUserProfile(req, res, next) {
  const { name, about } = req.body;
  const { userId } = req.user;
  User.findByIdAndUpdate(
    userId,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) return res.send({ user });
      throw new NotFoundError('Пользователь c указанным ID не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new BadRequestError(
            'Передача некорректных данных',
          ),
        );
      } else {
        next(err);
      }
    });
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  const { userId } = req.user;
  User.findByIdAndUpdate(
    userId,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) return res.send({ user });
      throw new NotFoundError('Пользователь c ID не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new BadRequestError(
            'Передача некорректных данных',
          ),
        );
      } else {
        next(err);
      }
    });
}

module.exports = {
  createUser,
  login,
  getUsersInfo,
  getUserById,
  getUserInfo,
  updateUserProfile,
  updateAvatar,
};
