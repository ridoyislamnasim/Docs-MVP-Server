const { Router } = require("express");
const controller = require("../../modules/user/user.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const UserRoute = Router();
// UserRoute.use(jwtAuth());

UserRoute.route("/")
  .post(upload.any(), controller.createUser)
  .get(controller.getAllUser);

UserRoute.get("/pagination", controller.getUserWithPagination);

UserRoute.route("/:id")
  .get(controller.getSingleUser)
  .put(upload.any(), controller.updateUser)
  .delete(controller.deleteUser);

module.exports = UserRoute;
