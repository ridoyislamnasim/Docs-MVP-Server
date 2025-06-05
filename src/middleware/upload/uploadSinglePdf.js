const fs = require('fs');
const config = require('../../config/config.js');

exports.uploadSinglePdf = async (file) => {
  fs.access(config.uploadFolder, (error) => {
    if (error) {
      fs.mkdirSync(config.uploadFolder);
    }
  });
  const { buffer, originalname } = file;
  const filePath = `${config.uploadFolder}${originalname}`;
  try {
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        console.error(err);
      }
    });
    return { success: true };
  } catch (err) {
    return err;
  }
};
