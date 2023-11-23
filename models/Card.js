const mongoose = require('mongoose');
const { urlRegexPattern } = require('../utils/constants');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const cardSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      message: 'Поле является обязательным',
      minlength: [2, 'Минимальная длина 2 символа'],
      maxlength: [30, 'Максимальная длина 30 символов'],
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (url) => urlRegexPattern.test(url),
        message: 'Поле является обязательным. Введите URL',
      },
    },
    owner: {
      type: ObjectId,
      ref: 'user',
      required: true,
    },
    likes: [
      {
        type: ObjectId,
        ref: 'user',
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardSchema);
