const express = require("express");
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/config.js');
// const User = require("../../models/auth/userSchema"); // Model import করুন
const { UserSchema } = require('../../models/auth/userSchema.js');

// // google Login route
// router.get('/auth/google',
//   passport.authenticate('google', { scope: ['email'] })
// );
// google login route
router.get('/auth/google', (req, res, next) => {

  passport.authenticate('google', {
    scope: ['email'],
  })(req, res, next);
});

// google callback route (custom callback)
router.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, profile, info) => {
    try {
      if (err || !profile) {
        // Error হলে redirectUrl-এ পাঠান
        const errorMsg = encodeURIComponent(err?.message || "unauthorized access");
        const redirectUrl = `${config.frontendUrl}/google/success?error=${errorMsg}`;
        return res.redirect(redirectUrl);
      }
const email = profile.emails && profile.emails[0] && profile.emails[0].value ? profile.emails[0].value : "";
      if (!email) {
        // Email না থাকলে error message সহ redirectUrl-এ পাঠান
        const errorMsg = encodeURIComponent("Email not found in Google profile");
        const redirectUrl = `${config.frontendUrl}/google/success?error=${errorMsg}`;
        return res.redirect(redirectUrl);
      }
      // 1. Check if user exists by googleId
          // console.log(" profile.id",  profile.id);
          // try {
      let user = await UserSchema.findOne({ email: email});
          // } catch (error) {
          //   console.error("Error finding user by googleId:", error);
          // }

    console.log("user",  user);
      // 2. If not, create new user
      if (!user) {
        user = await UserSchema.create({
          name: profile.displayName || (profile.name && profile.name.givenName) || "User",
          email: email,
          socialPhoto: profile.photos && profile.photos[0] && profile.photos[0].value ? profile.photos[0].value : "",
          phone: profile.phone || "",
        });
      }

      // 3. Prepare user info for token
      const user_info_encrypted = {
        id: user._id,
        name: user.name,
        email: user.email,
        socialPhoto: user.socialPhoto || "",
      };
      // 4. Generate tokens
      const accessToken = jwt.sign({ userInfo: { user_info_encrypted } }, config.jwtAccessSecretKey, { expiresIn: '365d' });
      const refreshToken = jwt.sign({ userInfo: { user_info_encrypted } }, config.jwtRefreshSecretKey, { expiresIn: '365d' });

      const encodedUser = encodeURIComponent(JSON.stringify(user_info_encrypted));
      const redirectUrl = `${config.frontendUrl}/google/success?accessToken=Bearer ${accessToken}&refreshToken=Bearer ${refreshToken}&user=${encodedUser}`;

      return res.redirect(redirectUrl);
    } catch (error) {
      // Error হলেও redirectUrl-এ পাঠান
      const errorMsg = encodeURIComponent(error.message || "Internal server error");
      const redirectUrl = `${config.frontendUrl}/google/success?error=${errorMsg}`;
      return res.redirect(redirectUrl);
    }
  })(req, res, next);
});



module.exports = router;