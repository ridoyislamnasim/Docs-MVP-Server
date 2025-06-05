const path = require('path');
const shortid = require('shortid');

exports.convertFileNameWithPdfExt = (fileOriginalName) => {
  const fileExt = path.extname(fileOriginalName);
  const fileName = `${fileOriginalName
    .replace(fileExt, '')
    .toLowerCase()
    .split(' ')
    .join('-')}-${shortid.generate()}.pdf`;
  return fileName;
};
