const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const uploadSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["batch", "class", "section"], // Restrict type to specific values
    },
    name: {
      type: String,
      required: true,
      unique: true, // Ensure names are unique
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Upload", uploadSchema);