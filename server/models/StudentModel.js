const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  leetcodeUsername: { type: String, required: true,  unique: true },
  batchName: { type: String, default: null },
  year: { type: String, required: true },
  isPlaced: { type: Boolean, default: false },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "companies", default: null },
});

module.exports = mongoose.model("students", studentSchema);