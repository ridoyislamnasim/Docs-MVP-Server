const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DocumentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
    type: Schema.Types.Mixed, // এখানে String-এর বদলে Mixed দিন
    default: "",
  },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    sharedWith: [
      {
        user: { type: Schema.Types.ObjectId, ref: "user" },
        role: { type: String, enum: ["viewer", "editor"], default: "editor" },
      },
    ],
    // For presence, you may track online users in-memory with Socket.IO, not in DB
  },
  { timestamps: true }
);

module.exports = mongoose.model("document", DocumentSchema);