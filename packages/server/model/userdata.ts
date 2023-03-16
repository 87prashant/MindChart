import mongoose from "mongoose";
import { ObjectId } from "bson"

const UserDataSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    data: [
      {
        thoughts: {
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
        _id: {type: ObjectId, unique: true, required: true}
      },
    ],
  },
  {
    collection: "userData",
  }
);

const model = mongoose.model("UserDataSchema", UserDataSchema);

export default model;
