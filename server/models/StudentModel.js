const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: { type: String, required: true },
  regNo: { type: String, required: true, unique: true },
  department: { type: String, required: true },
});

module.exports = mongoose.model("Student", studentSchema);