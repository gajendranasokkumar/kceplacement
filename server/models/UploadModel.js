const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const uploadSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["batch", "class", "section", "year", "department"], // Restrict type to specific values
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

uploadSchema.index({ type: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Upload", uploadSchema);