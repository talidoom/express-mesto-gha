const rateLimiter = require('express-rate-limit');

const limiter = rateLimiter({

  max: 120,

  windowMS: 60000,

  message: 'Превышено количество запросов, попробуйте повторить позже',
});

module.exports = limiter;
