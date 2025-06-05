const { convertFileNameWithWebpExt } = require('./index.js');

exports.convertObjOriginalImgNameWithWebpExt = (files) => {
  return files.map(({ buffer, originalname, fieldname }) => ({
    buffer,
    originalname: convertFileNameWithWebpExt(originalname),
    fieldname,
  }));
};
