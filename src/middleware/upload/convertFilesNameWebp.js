const { convertFileNameWithWebpExt } = require('./index.js');

module.exports.convertFilesNameWebp = (files) => {
  return files.map(({ buffer, originalname, fieldname }) => ({
    buffer,
    originalname: convertFileNameWithWebpExt(originalname),
    fieldname,
  }));
};
