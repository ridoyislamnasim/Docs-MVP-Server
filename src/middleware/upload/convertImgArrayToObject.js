const config = require('../../config/config.js');

exports.convertImgArrayToObject = (files) => {
  return files.reduce((total, file) => {
    if (total[file.fieldname]) {
      if (Array.isArray(total[file.fieldname])) {
        total[file.fieldname].push(`${config.uploadPath}${file.originalname}`);
      } else {
        total[file.fieldname] = [
          total[file.fieldname],
          `${config.uploadPath}${file.originalname}`,
        ];
      }
    } else {
      total[file.fieldname] = `${config.uploadPath}${file.originalname}`;
    }
    return total;
  }, {});
};
