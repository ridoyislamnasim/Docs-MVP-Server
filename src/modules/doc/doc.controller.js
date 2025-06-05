const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const DocService = require("./doc.service.js");

class DocController {
  createDoc = withTransaction(async (req, res, next, session) => {
    const payload = {
      title: req?.body?.title,
      owner: req?.user?.user_info_encrypted.id,
    };

    const docResult = await DocService.createDoc(payload,session);
    const resDoc = responseHandler(201,"Doc Created successfully",docResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllDocByUser = catchError(async (req, res, next) => {
    let payload = {
      owner: req?.user?.user_info_encrypted.id,
    };
    const docResult = await DocService.getAllDocByUser(payload);
    const resDoc = responseHandler(200, "Get All Docs", docResult);
    res.status(resDoc.statusCode).json(resDoc);
  });
 getShareDocWithPagination = catchError(async (req, res, next) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
      owner: req?.user?.user_info_encrypted.id,
    };
    const doc = await DocService.getShareDocWithPagination(payload);
    const resDoc = responseHandler(200, "Docs get successfully", doc);
    res.status(resDoc.statusCode).json(resDoc);
  });
  // getDocWithPagination = catchError(async (req, res, next) => {
  //   let payload = {
  //     page: req.query.page,
  //     limit: req.query.limit,
  //     order: req.query.order,
  //   };
  //   const doc = await DocService.getDocWithPagination(payload);
  //   const resDoc = responseHandler(200, "Docs get successfully", doc);
  //   res.status(resDoc.statusCode).json(resDoc);
  // });

  getSingleDoc = catchError(async (req, res, next) => {
    const { user_info_encrypted } = req?.user;
    const payload = {
      id: req.params.id,
      owner: user_info_encrypted.id,
    }
    const docResult = await DocService.getSingleDoc(payload);
    const resDoc = responseHandler(201, "Single Doc successfully", docResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  // updateDoc = catchError(async (req, res, next) => {
  //   const id = req.params.id;
  //   console.log("id", id);
  //   const payloadFiles = {
  //     files: req.files,
  //   };
  //   const payload = {
  //     title: req?.body?.title,
  //     details: req?.body?.details,
  //     author: req?.body?.author,
  //     tags: req?.body?.tags,
  //     status: req?.body?.status,
  //   };
  //   const docResult = await DocService.updateDoc(id, payload, payloadFiles);
  //   const resDoc = responseHandler(201, "Doc Update successfully", docResult);
  //   res.status(resDoc.statusCode).json(resDoc);
  // });

  // updateDocStatus = catchError(async (req, res, next) => {
  //   const id = req.params.id;
  //   const status = req.query.status;
  //   const docResult = await DocService.updateDocStatus(id, status);
  //   const resDoc = responseHandler(201, "Doc Status Update successfully");
  //   res.status(resDoc.statusCode).json(resDoc);
  // });

  shareDoc = catchError(async (req, res, next) => {
    const id = req.params.id;
    const payload = {
      userId: req?.user?.user_info_encrypted.id,
      email: req?.body?.email,
      role: req?.body?.role,
    };

    const docResult = await DocService.shareDoc(id, payload);
    const resDoc = responseHandler(201, "Doc Shared successfully", docResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteDoc = catchError(async (req, res, next) => {
    const id = req.params.id;

    const docResult = await DocService.deleteDoc(id);
    const resDoc = responseHandler(200, "Doc Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new DocController();
