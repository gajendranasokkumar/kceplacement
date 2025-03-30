const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  description: { type: String },
  website: { type: String },
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

module.exports = mongoose.model("companies", CompanySchema);