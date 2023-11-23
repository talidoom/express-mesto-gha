const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlRegexPattern } = require('../utils/constants');

const {
  getUsersInfo,
  getUserById,
  getUserInfo,
  updateUserProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsersInfo);

router.get('/me', getUserInfo);

router.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().length(24).hex().required(),
    }),
  }),
  getUserById,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserProfile,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(urlRegexPattern),
    }),
  }),
  updateAvatar,
);

module.exports = router;
