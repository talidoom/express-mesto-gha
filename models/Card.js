const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: {
      value: true,
      message: 'Поле является обязательным',
    },
    minlength: [2, 'Минимальная длина 2 символа'],
    maxlength: [30, 'Максимальная длина 30 символов'],
  },
  link: {
    type: String,
    required: {
      value: true,
      message: 'Поле является обязательным',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: {
      value: true,
    },
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.export = mongoose.model('card', cardSchema);
