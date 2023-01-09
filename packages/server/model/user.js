const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: String, required: true, immutable: true },
    status: { type: String },
    verificationToken: { type: String },
  },
  {
    collection: "userCredentials",
  }
);

const model = mongoose.model("UserSchema", UserSchema);

module.exports = model;
