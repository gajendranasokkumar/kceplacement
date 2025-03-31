const StudentModel = require("../models/StudentModel");
const UploadModel = require("../models/UploadModel");

async function processStudentData(studentData) {
  const { name, rollNo, department, leetcodeUsername, year, batchName } = studentData;

  // Ensure the year, batch, and department exist in UploadModel
  const ensureUploadEntry = async (type, name) => {
    const existingEntry = await UploadModel.findOne({ type, name });
    if (!existingEntry) {
      await UploadModel.create({ type, name });
    }
  };

  await ensureUploadEntry("year", year);
  await ensureUploadEntry("batch", batchName);
  await ensureUploadEntry("department", department);

  // Check if a student with the same rollNo or leetcodeUsername already exists
  const existingStudent = await StudentModel.findOne({
    $or: [{ rollNo }, { leetcodeUsername }],
  });

  if (existingStudent) {
    // Update the existing student
    await StudentModel.updateOne(
      { rollNo },
      { name, department, year, batchName }
    );
  } else {
    // Create a new student
    await StudentModel.create({
      name,
      rollNo,
      department,
      leetcodeUsername,
      year,
      batchName,
    });
  }
}

module.exports = { processStudentData };
