class GeneralError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GeneralError';
    this.statusCode = 500;
  }
}

class BadRequestError extends GeneralError {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
  }
}

class UnauthorizedError extends GeneralError {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

class NotFoundError extends GeneralError {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ConflictError extends GeneralError {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

module.exports = {
  GeneralError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError
};
