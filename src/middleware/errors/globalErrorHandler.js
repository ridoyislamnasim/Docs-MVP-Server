const globalErrorHandler = (err, req, res, next) => {
  let code = err.statusCode ? err.statusCode : 500;
  let message = err.message;


  res.status(code).json({
    statusCode: code,
    status: 'error',
    message,
  });
};

module.exports = globalErrorHandler;
