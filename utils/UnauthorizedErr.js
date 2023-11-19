const STATUS_CODES = {
  UNAUTHORIZED: 401,
};

module.exports = class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODES.UNAUTHORIZED;
  }
};
