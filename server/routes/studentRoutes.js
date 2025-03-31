const express = require("express");
const router = express.Router();
const StudentModel = require("../models/StudentModel");
const UploadModel = require("../models/UploadModel");
const mongoose = require("mongoose");
const authenticate = require("../middlewares/authenticate"); // Import authentication middleware

// Fetch students by batch or year
router.get("/", authenticate, async (req, res) => {
  const { batch, year, department } = req.query;

  try {
    const query = {};
    if (batch) query.batchName = batch;
    if (year) query.year = year;
    if(department) query.department = department;
    if (!batch && !year && !department) {
      return res.status(400).json({ error: "Either batch or year or department must be provided" });
    }

    const students = await StudentModel.find(query);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// Bulk update isPlaced and assign company
router.put("/update-placement", authenticate, async (req, res) => {
  const { studentIds, companyName } = req.body;


  if (!studentIds || studentIds.length === 0 || !companyName) {
    return res.status(400).json({ error: "Student IDs and company name are required" });
  }

  // Validate companyName as ObjectId
  if (!mongoose.Types.ObjectId.isValid(companyName)) {
    return res.status(400).json({ error: "Invalid company ID" });
  }

  try {
    const result = await StudentModel.updateMany(
      { _id: { $in: studentIds } },
      { isPlaced: true, company: companyName }
    );

    res.status(200).json({
      message: "Placement status updated successfully for selected students",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating placement status:", error);
    res.status(500).json({ error: "Failed to update placement status" });
  }
});

// Remove company for selected students
router.put("/remove-company", authenticate, async (req, res) => {
  const { studentIds } = req.body;

  if (!studentIds || studentIds.length === 0) {
    return res.status(400).json({ error: "Student IDs are required" });
  }

  try {
    const result = await StudentModel.updateMany(
      { _id: { $in: studentIds } },
      { isPlaced: false, company: null }
    );

    res.status(200).json({
      message: "Company removed successfully for selected students",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error removing company:", error);
    res.status(500).json({ error: "Failed to remove company for students" });
  }
});

// Update batch for multiple students
router.put("/update-batch", authenticate, async (req, res) => {
  const { studentIds, batchName } = req.body;

  if (!studentIds || !batchName) {
    return res.status(400).json({ error: "Student IDs and batch name are required" });
  }

  try {
    // Ensure the batch exists in the UploadModel
    let batch = await UploadModel.findOne({ type: "batch", name: batchName });
    if (!batch) {
      batch = await UploadModel.create({ type: "batch", name: batchName });
    }

    // Update the batch for the selected students
    const result = await StudentModel.updateMany(
      { _id: { $in: studentIds } },
      { batchName }
    );

    res.status(200).json({
      message: "Batch updated successfully for selected students",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating batch:", error);
    res.status(500).json({ error: "Failed to update batch for students" });
  }
});

// Delete students by batch or year
router.delete("/", authenticate, async (req, res) => {
  const { batch, year } = req.query;

  try {
    const query = {};

    if (!batch && !year) {
      return res.status(400).json({ error: "Either batch or year must be provided" });
    }

    // Build the query for deleting students
    if (batch) query.batchName = batch;
    if (year) query.year = year;

    // Delete students from the StudentModel
    const studentResult = await StudentModel.deleteMany(query);

    // Delete the corresponding batch or year from the UploadModel
    if (batch) {
      await UploadModel.deleteOne({ type: "batch", name: batch });
    }
    if (year) {
      await UploadModel.deleteOne({ type: "year", name: year });
    }

    res.status(200).json({
      message: "Students and corresponding batch/year deleted successfully",
      studentResult,
    });
  } catch (error) {
    console.error("Error deleting students or batch/year:", error);
    res.status(500).json({ error: "Failed to delete students or batch/year" });
  }
});

router.delete("/selected", authenticate, async (req, res) => {
  const { studentIds } = req.body;

  if (!studentIds || studentIds.length === 0) {
    return res.status(400).json({ error: "Student IDs are required" });
  }

  try {
    // Delete students from the database
    const result = await StudentModel.deleteMany({ _id: { $in: studentIds } });

    res.status(200).json({
      message: "Selected students deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting students:", error);
    res.status(500).json({ error: "Failed to delete students" });
  }
});

// Fetch unique departments and batches
router.get("/filters", authenticate, async (req, res) => {
  try {
    const departments = await StudentModel.distinct("department");
    const batches = await StudentModel.distinct("batchName");

    res.status(200).json({ departments, batches });
  } catch (error) {
    console.error("Error fetching filters:", error);
    res.status(500).json({ error: "Failed to fetch filters" });
  }
});

// Update a student's details
router.put("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, rollNo, department, batchName, year } = req.body;

  try {
    const updatedStudent = await StudentModel.findByIdAndUpdate(
      id,
      { name, rollNo, department, batchName, year },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ message: "Student updated successfully", student: updatedStudent });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Failed to update student" });
  }
});

module.exports = router;