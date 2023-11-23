const Card = require('../models/Card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const AccessDeniedError = require('../errors/AccessDeniedError');
const { HTTP_CREATED_CODE } = require('../utils/constants');

function getCards(_, res, next) {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const { userId } = req.user;
  Card.create({ name, link, owner: userId })
    .then((card) => res.status(HTTP_CREATED_CODE).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Передача некорректных данных, при попытке добавления новой карточки на страницу.',
          ),
        );
      } else {
        next(err);
      }
    });
}

function deleteCard(req, res, next) {
  const { id: cardId } = req.params;
  const { userId } = req.user;
  Card.findById({
    _id: cardId,
  })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка c передаваемым ID не найдена');
      }
      const { owner: cardOwnerId } = card;

      if (cardOwnerId.valueOf() !== userId) {
        throw new AccessDeniedError('Нет прав доступа');
      }
      return Card.findByIdAndDelete(cardId);
    })
    .then((deletedCard) => {
      if (!deletedCard) {
        throw new NotFoundError('Данная карточка была удалена');
      }
      res.send({ data: deletedCard });
    })
    .catch(next);
}

function likeCard(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user;
  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: {
        likes: userId,
      },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card) return res.send({ data: card });
      throw new NotFoundError('Карточка с данным ID не найдена');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new BadRequestError(
            'Передача некорректных данных при попытке поставить лайк.',
          ),
        );
      } else {
        next(err);
      }
    });
}

function dislikeCard(req, res, next) {
  const { cardId } = req.params;
  const { userId } = req.user;
  Card.findByIdAndUpdate(
    cardId,
    {
      $pull: {
        likes: userId,
      },
    },
    {
      new: true,
    },
  )
    .then((card) => {
      if (card) return res.send({ data: card });
      throw new NotFoundError('Карточка c ID не найдена');
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
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
