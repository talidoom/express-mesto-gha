const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,

};
const Card = require('../models/Card');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CODES.CREATED).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.SERVER_ERROR).send({ message: err.message });
      } else {
        console.error(err.message);
        res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Карточка не найдена' });
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(STATUS_CODES.OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Requested user not found' });
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(STATUS_CODES.OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Requested user not found' });
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
