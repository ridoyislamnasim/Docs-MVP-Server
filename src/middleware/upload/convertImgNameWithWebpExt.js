import path from 'path';
import shortid from 'shortid';

export const convertImgNameWithWebpExt = (fileOriginalName) => {
  const fileExt = path.extname(fileOriginalName);
  const fileName = `${fileOriginalName
    .replace(fileExt, '')
    .toLowerCase()
    .split(' ')
    .join('-')}-${shortid.generate()}.webp`;
  return fileName;
};
