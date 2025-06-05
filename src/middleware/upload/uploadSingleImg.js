const fs = require('fs');
const config = require('../../config/config.js');
// const sharp = require('sharp');

exports.uploadSingleImg = async (file) => {
  fs.access(config.uploadFolder, (error) => {
    if (error) {
      fs.mkdirSync(config.uploadFolder);
    }
  });
  const { buffer, originalname } = file;

  // try {
  //   const webpBuffer = await sharp(buffer).toBuffer();
  //   await sharp(webpBuffer).toFile(`${config.uploadFolder}${originalname}`);
  //   return { success: true };
  // } catch (err) {
  //   return err;
  // }

  try {
    fs.writeFileSync(`${config.uploadFolder}${originalname}`, buffer);
    return { success: true };
  } catch (err) {
    return err;
  }
};



