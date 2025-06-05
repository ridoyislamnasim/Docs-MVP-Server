const { Router } = require('express');
const controller = require('../../modules/auth/auth.controller.js');
const { upload } = require('../../middleware/upload/upload.js');
const jwtAuth = require('../../middleware/auth/jwtAuth.js');

const AuthRouter = Router();
AuthRouter
  .post('/signup',upload.any(), controller.authUserSingUp)
  .post('/signin', controller.authUserSignIn)
  .post('/forget-password', controller.authForgetPassword)
  .post('/forget-password/otp-verification', controller.authForgetPasswordVarification)
  .get('/', jwtAuth('admin', ), controller.getUserById)
  .put('/', upload.any(), jwtAuth('admin', ), controller.updateUser)
  .get('/user',
    // jwtAuth('admin'),
    controller.getAllUser)
  .get('/user/search', controller.getUserSearchByEmail)
  .get('/user/:id', controller.getSingleUser)
  .delete('/user/:id', controller.getDeleteUser);

module.exports = AuthRouter;
