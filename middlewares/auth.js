const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../utils/constants');

const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, _, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new UnauthorizedError(`${'Передан неверный логин или пароль'}(${authorization})!`));
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError(`${'Передан неверный логин или пароль'}!`));
  }

  req.user = payload;

  return next();
};
