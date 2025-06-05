require("dotenv/config");

const {
  PORT,
  HOST,
  MONGO_CONNECTION_STRING,
  MONGO_PASSWORD,
  JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY,
  UPLOAD_FOLDER,
  UPLOAD_PATH,
  CLIENT_BASE_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  SERVER_URL,
  FRONTEND_URL,
} = process.env;

const config = {
  port: PORT,
  host: HOST,
  databaseUrl: MONGO_CONNECTION_STRING,
  databasePassword: MONGO_PASSWORD,
  jwtAccessSecretKey: JWT_ACCESS_SECRET_KEY,
  jwtRefreshSecretKey: JWT_REFRESH_SECRET_KEY,
  uploadFolder: UPLOAD_FOLDER,
  uploadPath: UPLOAD_PATH,
  clientBaseURL: CLIENT_BASE_URL,
  googleClientId: GOOGLE_CLIENT_ID,
  googleClientSecret: GOOGLE_CLIENT_SECRET,
  serverUrl: SERVER_URL,
  frontendUrl: FRONTEND_URL,
};

module.exports = config;
