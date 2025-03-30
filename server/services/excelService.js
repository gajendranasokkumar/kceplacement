const xlsx = require("xlsx");
const NotificationModel = require("../models/NotificationModel");
const StudentModel = require("../models/StudentModel");
const UploadModel = require("../models/UploadModel"); // Import UploadModel
const io = require("../socket");

async function processExcelFile(filePath, userId) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  let successCount = 0;
  let failureCount = 0;
  const failureDocuments = [];

  // Helper function to ensure year or batch exists in UploadModel
  const ensureUploadEntry = async (type, name) => {
    const existingEntry = await UploadModel.findOne({ type, name });
    if (!existingEntry) {
      await UploadModel.create({ type, name });
      console.log(`Added new ${type}: ${name}`);
    }
  };

  // Process each row in the Excel sheet
  for (const row of sheetData) {
    try {
      // Validate required fields
      
      if (!row.name || !row.rollNo || !row.department || !row.leetcodeUsername || !row.year || !row.batchName) {
        throw new Error(
          "Missing required fields: name, rollNo, department, leetcodeUsername, year, or batch"
        );
      }

      // Ensure the year and batch exist in the UploadModel
      await ensureUploadEntry("year", row.year);
      await ensureUploadEntry("batch", row.batchName);

      // Check if a student with the same rollNo or leetcodeUsername already exists
      const existingStudent = await StudentModel.findOne({
        $or: [
          { rollNo: row.rollNo },
          { leetcodeUsername: row.leetcodeUsername },
        ],
      });

      if (existingStudent) {
        // Check if we're trying to assign a leetcodeUsername that exists but for a different rollNo
        if (existingStudent.rollNo !== row.rollNo && existingStudent.leetcodeUsername === row.leetcodeUsername) {
          throw new Error(
            `LeetCode username '${row.leetcodeUsername}' already assigned to another student with rollNo '${existingStudent.rollNo}'`
          );
        }

        // Check if we're trying to assign a rollNo that exists but with a different leetcodeUsername
        if (existingStudent.rollNo === row.rollNo && existingStudent.leetcodeUsername !== row.leetcodeUsername) {
          throw new Error(
            `Student with rollNo '${row.rollNo}' already exists with a different LeetCode username '${existingStudent.leetcodeUsername}'`
          );
        }

        // Update the existing student if both rollNo and leetcodeUsername match
        if (existingStudent.rollNo === row.rollNo && existingStudent.leetcodeUsername === row.leetcodeUsername) {
          await StudentModel.updateOne(
            { rollNo: row.rollNo },
            {
              name: row.name,
              department: row.department,
              year: row.year,
              batchName: row.batchName || null,
            }
          );
          console.log("Updated existing student:", row.rollNo);
          successCount++;
        } else {
          // This case shouldn't happen with the above checks, but just in case
          throw new Error(
            `Conflict with existing student data for rollNo '${row.rollNo}' or leetcodeUsername '${row.leetcodeUsername}'`
          );
        }
      } else {
        // Create a new student when neither rollNo nor leetcodeUsername exists
        await StudentModel.create({
          name: row.name,
          rollNo: row.rollNo,
          department: row.department,
          leetcodeUsername: row.leetcodeUsername,
          year: row.year,
          batchName: row.batchName || null,
        });
        console.log("Created new student:", row.rollNo);
        successCount++;
      }
    } catch (error) {
      // Handle failures and add them to the failureDocuments array
      failureCount++;
      failureDocuments.push({
        row,
        error: error.message,
      });
      console.error(`Error processing row ${JSON.stringify(row)}:`, error.message);
    }
  }

  // Determine the notification title based on success and failure counts
  const notificationTitle =
    failureCount > 0
      ? "Excel Processing Completed with Errors"
      : "Excel Processing Completed Successfully";

  // Save a notification to the database, including failure documents
  try {
    const notification = await NotificationModel.create({
      userId,
      title: notificationTitle,
      message: `Success: ${successCount}, Failures: ${failureCount}`,
      failureDocuments, // Add failure documents to the notification
    });
    console.log("Notification created:", notification._id);
  } catch (notificationError) {
    console.error("Failed to save notification:", notificationError.message);
  }

  // Emit a socket event to the user
  io.to(userId).emit("excelProcessingComplete", {
    successCount,
    failureCount,
    failureDocuments,
  });

  return { successCount, failureCount, failureDocuments };
}

module.exports = { processExcelFile };