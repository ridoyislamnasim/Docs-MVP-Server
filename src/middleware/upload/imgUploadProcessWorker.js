const { workerData, parentPort } = require('worker_threads');
const { uploadSingleImg, uploadSinglePdf } = require('./index');
const isArrayElementExist = require('../../utils/isArrayElementExist');

const { file } = workerData;

(async () => {
  try {
    if (isArrayElementExist(file)) {
      // Use for...of for async handling
      for (const element of file) {
        if (element.mimetype == 'application/pdf') {
          await uploadSinglePdf(element);
        } else {
          await uploadSingleImg(element);
        }
      }
    } else {
      if (file.mimetype == 'application/pdf') {
        await uploadSinglePdf(file);
      } else {
        await uploadSingleImg(file);
      }
    }
    parentPort.postMessage({ success: true });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
})();
