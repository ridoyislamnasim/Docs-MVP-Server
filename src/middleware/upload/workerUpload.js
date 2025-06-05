const { Worker } = require('worker_threads');
const path = require('path');

exports.workerUpload = (imgFile) => {
  const worker = new Worker(
    path.join(process.cwd(), '/src/middleware/upload/fileUploadWorker.js'),
    {
      workerData: {
        imgFile: imgFile,
      },
    }
  );
  worker.on('message', (message) => {
    return message;
  });
  worker.on('error', (err) => {
    return err;
  });
};
