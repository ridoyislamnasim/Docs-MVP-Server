const { NotFoundError } = require('../../utils/errors.js');
const pagination = require('../../utils/pagination.js');

class BaseService {
  #repository;
  constructor(repository, serviceName) {
    this.#repository = repository;
    this.serviceName = serviceName;
  }
}

module.exports = BaseService;
