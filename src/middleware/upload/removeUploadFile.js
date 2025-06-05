const fs = require('fs/promises');
const path = require('path');
const config = require('../../config/config.js');

exports.removeUploadFile = async (fileUrl) => {
  const fileName = path.basename(fileUrl);
  const removeFile = `${config.uploadFolder}${fileName}`;
  try {
    await fs.unlink(removeFile);
  } catch (err) {
    console.error('Error removing file:', err);
    throw new Error('File removal failed');
  }
};
