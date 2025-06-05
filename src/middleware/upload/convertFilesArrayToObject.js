const config = require('../../config/config.js');

module.exports.convertFilesArrayToObject = (files) => {
  return files.reduce((total, file) => {
    return {
      [`${file.fieldname}`]: `${config.uploadPath}${file.originalname}`,
      ...total,
    };
  }, {});
};
