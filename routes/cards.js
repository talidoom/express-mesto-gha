const cardRouter = require('express').Router();
const { getCards } = require('../controllers/cards');

cardRouter.get('/cards', getCards);

module.exports = cardRouter;
