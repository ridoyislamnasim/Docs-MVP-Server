import { workerData, parentPort } from 'worker_threads';
import fs from 'fs';
import sharp from 'sharp';
import config from '../../config/config.js';

const { imgFile } = workerData;

const uploadSingleFile = async (file) => {
  fs.access(config.uploadFolder, (error) => {
    if (error) {
      fs.mkdirSync(config.uploadFolder);
    }
  });
  const { buffer, originalname } = file;
  try {
    const webpBuffer = await sharp(buffer).webp().toBuffer();

    await sharp(webpBuffer)
      .webp({ quality: 20 })
      .toFile(`${config.uploadFolder}${originalname}`);
  } catch (err) {
  }
};

imgFile.forEach((element) => {
  uploadSingleFile(element);
});

parentPort.postMessage({ success: true });
