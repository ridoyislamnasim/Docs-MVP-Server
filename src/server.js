const cors = require("cors");
const express = require("express");
const moment = require("moment-timezone");
const morgan = require("morgan");
const mongoose = require("mongoose");
const rootRouter = require("./api/index.js");
const config = require("./config/config.js");
const globalErrorHandler = require("./middleware/errors/globalErrorHandler.js");
const http = require("http");
const { Server } = require('socket.io');
const setupSocket = require("./socket");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const googleAuthRouter = require('./api/routes/googleAuth'); 

require("dotenv").config();
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Adjust as needed
        methods: ['GET', 'POST']
    }
});


moment.tz.setDefault("Asia/Dhaka");
const currentDate = moment();

passport.use(new GoogleStrategy({
    clientID: config.googleClientId,         
    clientSecret: config.googleClientSecret, 
    callbackURL: `${config.serverUrl}/auth/google/callback`
  },
  function(accessToken, refreshToken, profile, done) {
    // Find or create user in your DB here
    return done(null, profile);
  }
));

app.use(googleAuthRouter);

app.use(`/api/v1${config.uploadPath}`, express.static(config.uploadFolder));
app.use("/api/v1", rootRouter);

app.get("/api", (req, res, next) => {
  res.send("welcome to Ridoy islam nasim");
});

app.get("/time", (req, res, next) => {
  res.send(currentDate.format("YYYY-MM-DD HH:mm:ss"));
});

app.use(globalErrorHandler);

mongoose
  .connect(config.databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connection successful! --------------"))
  .catch((err) => {
    console.error("Database connection error:", err.message);
    console.error("Full error details:", err);
  });


// Socket.IO events
setupSocket(server);

server.listen(config.port, (err) => {
  if (err) {
    console.error('❌ Failed to start server with Socket.IO:', err);
  } else {
    console.log(`✅ Server (with Socket.IO) listening on port`, config.port);
  }
});
