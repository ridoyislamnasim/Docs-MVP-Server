const path = require('path');
const shortid = require('shortid');

exports.convertImgToSvgExt = (fileOriginalName) => {
  const fileExt = path.extname(fileOriginalName);
  const fileName = `${fileOriginalName
    .replace(fileExt, '')
    .toLowerCase()
    .split(' ')
    .join('-')}-${shortid.generate()}.svg`;
  return fileName;
};
