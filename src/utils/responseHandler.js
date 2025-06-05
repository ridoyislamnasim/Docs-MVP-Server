const responseHandler = (statusCode, message, data) => {
  return {
    statusCode,
    status: 'success',
    message,
    ...(data && { data }),
  };
};

module.exports = responseHandler;
