const UploadModel = require("../models/UploadModel"); // Use the new UploadModel

// Fetch all batches
async function getBatches() {
  return await UploadModel.find({ type: "batch" });
}

// Add a new batch
async function addBatch(name) {
  return await UploadModel.create({ type: "batch", name });
}

// Delete a batch by ID
async function deleteBatch(id) {
  return await UploadModel.findByIdAndDelete(id);
}

// Fetch all classes
async function getClasses() {
  return await UploadModel.find({ type: "class" });
}

// Add a new class
async function addClass(name) {
  return await UploadModel.create({ type: "class", name });
}

// Delete a class by ID
async function deleteClass(id) {
  return await UploadModel.findByIdAndDelete(id);
}

// Fetch all sections
async function getSections() {
  return await UploadModel.find({ type: "section" });
}

// Add a new section
async function addSection(name) {
  return await UploadModel.create({ type: "section", name });
}

// Delete a section by ID
async function deleteSection(id) {
  return await UploadModel.findByIdAndDelete(id);
}

async function getBatches() {
  return await UploadModel.find({ type: "batch" });
}

// Fetch all years
async function getYears() {
  return await UploadModel.find({ type: "year" });
}

module.exports = {
  getBatches,
  addBatch,
  deleteBatch,
  getClasses,
  addClass,
  deleteClass,
  getSections,
  addSection,
  deleteSection,
  getBatches,
  getYears,
};