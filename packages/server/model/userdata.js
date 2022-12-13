const mongoose = require("mongoose");

const UserDataSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    data: [
      {
        categories: {
          creative: { type: Boolean },
          concrete: { type: Boolean },
          abstract: { type: Boolean },
          analytical: { type: Boolean },
          critical: { type: Boolean },
          unknown: { type: Boolean },
        },
        emotions: {
          neutral: { type: Number },
          fear: { type: Number },
          joy: { type: Number },
          anticipation: { type: Number },
          trust: { type: Number },
          anger: { type: Number },
          surprise: { type: Number },
          sadness: { type: Number },
        },
        priority: { type: Number },
        description: { type: String },
      },
    ],
  },
  {
    collection: "userData",
  }
);

const model = mongoose.model("UserDataSchema", UserDataSchema);

module.exports = model;
