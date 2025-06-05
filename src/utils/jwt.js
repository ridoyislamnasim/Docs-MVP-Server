const Jwt = require('jsonwebtoken');
const config = require('../config/config.js');

const generateAccessToken = (payload) => {
  return Jwt.sign(payload, config.jwtAccessSecretKey, {
    expiresIn: '30d',
  });
};

const generateRefreshToken = (payload) => {
  return Jwt.sign(payload, config.jwtRefreshSecretKey, {
    expiresIn: '365d',
  });
};

const verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    Jwt.verify(token, config.jwtAccessSecretKey, (err, payload) => {
      if (err) {
        return reject(err);
      }
      resolve(payload);
    });
  });
};

const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    Jwt.verify(token, config.jwtRefreshSecretKey, (err, payload) => {
      if (err) {
        return reject(err);
      }
      resolve(payload);
    });
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
