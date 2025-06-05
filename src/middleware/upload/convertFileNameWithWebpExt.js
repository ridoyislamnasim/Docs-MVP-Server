const path = require('path');
const shortid = require('shortid');

module.exports.convertFileNameWithWebpExt = (fileOriginalName) => {
  const fileExt = path.extname(fileOriginalName);
  const fileNameWithoutExt = fileOriginalName.replace(fileExt, '');

  const fileName = `${fileNameWithoutExt
    .toLowerCase()
    .split(' ')
    .join('-')}-${shortid.generate()}${fileExt}`;
  return fileName;
};
