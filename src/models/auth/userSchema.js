const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Userschema = new Schema(
  {
     googleId: {
      type: String,
      unique: true,
    },
    userId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
      // unique: true,
    },
    password: {
      type: String,
      // required: true,
    },
    image: { 
      type: String,
    },
    otp: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserSchema = mongoose.model("user", Userschema);

module.exports = { UserSchema };
