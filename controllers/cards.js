const Card = require('../models/Card');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

const createCard = (req, res) => {
  console.log(req.user._id);
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({ message: 'Карточка удалена' }))
        .catch(next);
    })
    .catch((error) => res.status(500).send({ message: 'Ошибка на стороне сервера', error: message }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
};
