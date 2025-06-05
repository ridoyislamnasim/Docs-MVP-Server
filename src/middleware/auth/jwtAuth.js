
// const { BadRequestError } = require('../../utils/errors.js');
// const { verifyAccessToken } = require('../../utils/jwt.js');

// const jwtAuth = (...role) => { // rider, branch, admin, merchant
//   return async (req, res, next) => {
//     try {
//       const bearer = req.headers.authorization || req.headers.Authorization;
//       if (!bearer || !bearer.startsWith('Bearer ')) {
//         throw new BadRequestError('token not found');
//       }
//       const token = bearer.split('Bearer ')[1].trim();
//       const payload = await verifyAccessToken(token);
//       if (!payload) throw new BadRequestError('unauthorized');

//       if (!role.includes(payload.userInfo.user_info_encrypted.role)) {
//         throw new BadRequestError('unauthorized');
//       }
//       req.user = { ...payload.userInfo };
//       next();
//     } catch (err) {
//       next(err);
//     }
//   }
// };

// module.exports = jwtAuth;


const { BadRequestError } = require('../../utils/errors.js');
const { verifyAccessToken } = require('../../utils/jwt.js');
const { RoleSchema } = require('../../models/index.js');

const jwtAuth = (requiredRoles, permission) => {
  return async (req, res, next) => {
    try {
      const bearer = req.headers.authorization || req.headers.Authorization;
      console.log('Bearer Token:', bearer);
      if (!bearer || !bearer.startsWith('Bearer ')) {
        throw new BadRequestError('Token not found');
      }

      const token = bearer.split('Bearer ')[1].trim();
      const payload = await verifyAccessToken(token);
      if (!payload) throw new BadRequestError('Unauthorized');

      // const userRoleRef = payload.userInfo.user_info_encrypted.roleRef;
      // if (!requiredRoles) {
      //   const rolePermissions = await RoleSchema.findOne({ _id: userRoleRef }).lean();
      //   if (!rolePermissions || !rolePermissions.permissions[permission.module]?.[permission.action]) {
      //     throw new BadRequestError('Permission denied');
      //   }
      // } else if (!requiredRoles.includes(userRole)) {
      //   throw new BadRequestError('Role unauthorized');
      // }

      req.user = { ...payload.userInfo };
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = jwtAuth;

