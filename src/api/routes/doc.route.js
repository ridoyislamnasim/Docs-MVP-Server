const { Router } = require("express");
const controller = require("../../modules/doc/doc.controller.js");
const { upload } = require("../../middleware/upload/upload.js");
const jwtAuth = require("../../middleware/auth/jwtAuth.js");

const DocRouter = Router();
DocRouter.use(jwtAuth()); // প্রোডাকশনে আনকমেন্ট করুন

// Create new document
DocRouter.post("/", controller.createDoc);

// Get all docs owned by user
DocRouter.get("/", controller.getAllDocByUser);

// Get all docs shared with user
// DocRouter.get("/shared", controller.getSharedDocs);

// Pagination (optional)
// DocRouter.get("/pagination", controller.getDocWithPagination);
DocRouter.get("/pagination/share", controller.getShareDocWithPagination);

// Get, update, delete single doc
DocRouter.route("/:id")
  .get(controller.getSingleDoc)
//   .put(upload.any(), controller.updateDoc)
  .delete(controller.deleteDoc);

// Share document with user (by email)
DocRouter.post("/:id/share", controller.shareDoc);

// Change permission (viewer/editor) for a shared user
// DocRouter.put("/:id/permission", controller.changePermission);

// Remove a user from sharedWith
// DocRouter.delete("/:id/unshare/:userId", controller.unshareDoc);

// For real-time presence, use Socket.IO, not REST

module.exports = DocRouter;
