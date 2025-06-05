const catchError = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      console.log("Error while ", err);
      next(err);
    }
  };
};

module.exports = catchError;

