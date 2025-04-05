const StudentModel = require("../models/StudentModel");
const UploadModel = require("../models/UploadModel");

async function processStudentData(studentData) {
  let { name, rollNo, department, leetcodeUsername, gfgUsername, codechefUsername, year, batchName } = studentData;

  // Convert specified fields to uppercase
  name = name.toUpperCase();
  rollNo = rollNo.toUpperCase();
  department = department.toUpperCase();
  batchName = batchName.toUpperCase();

  if (!gfgUsername || !codechefUsername) {
    throw new Error("gfgUsername and codechefUsername are required");
  }

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
      { name, department, year, batchName, gfgUsername, codechefUsername }
    );
  } else {
    // Create a new student
    await StudentModel.create({
      name,
      rollNo,
      department,
      leetcodeUsername,
      gfgUsername,
      codechefUsername,
      year,
      batchName,
    });
  }
}

module.exports = { processStudentData };
