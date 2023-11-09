const cardRouter = require('express').Router();
const {
  getCards, createCard, deleteCard, dislikeCard, likeCard,
} = require('../controllers/cards');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', createCard);
cardRouter.delete('/cards/:cardId', deleteCard);
cardRouter.delete('/cards/:cardId/likes', dislikeCard);
cardRouter.put('/cards/:cardId/likes', likeCard);

module.exports = cardRouter;
