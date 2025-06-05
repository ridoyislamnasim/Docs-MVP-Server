const { convertFileNameWithPdfExt } = require("./convertFileNameWithPdfExt");
const { convertFileNameWithWebpExt } = require("./convertFileNameWithWebpExt");
const { convertImgArrayToObject } = require("./convertImgArrayToObject");
const { uploadWorker } = require("./uploadWorker");
const { isMainThread } = require("worker_threads");

const ImgUploader = async (files)=>{
    let image;
    if (Array.isArray(files) && files.length > 0 && isMainThread) {
      const imgFile = files.map(
        ({ buffer, originalname, fieldname, mimetype }) => ({
          buffer,
          originalname:
            mimetype === "application/pdf"
              ? convertFileNameWithPdfExt(originalname)
              : convertFileNameWithWebpExt(originalname),
          fieldname,
          mimetype,
        })
      );
      for (let file of imgFile) {
        try {
          await uploadWorker(file); 
        } catch (error) {
          console.error("Error uploading file:", error);
          throw new Error("File upload failed");
        }
      }
      image = convertImgArrayToObject(imgFile);
    } else {
      throw new Error("Invalid or empty files array");
    }
    return image;
}

module.exports = ImgUploader;