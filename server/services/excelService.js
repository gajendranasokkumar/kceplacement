const xlsx = require("xlsx");
const { v4: uuidv4 } = require("uuid");
const NotificationModel = require("../models/NotificationModel");
const { excelQueue, requestJobTracker } = require("../queues/excelQueue");
const { getSocket } = require("../socket");

async function processExcelFile(fileBuffer, userId) {
  try {
    // Validate the file buffer
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error("Invalid or empty file buffer");
    }

    // Read the Excel file from the buffer
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });

    // Validate the workbook
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error("No sheets found in the Excel file");
    }

    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Validate the sheet data
    if (!Array.isArray(sheetData) || sheetData.length === 0) {
      throw new Error("No data found in the Excel sheet");
    }

    const requestId = uuidv4();
    const totalJobs = sheetData.length;

    // Initialize job tracker
    const tracker = { total: totalJobs, completed: 0, errors: [] };
    requestJobTracker.set(requestId, tracker);

    // Emit initial socket event
    const io = getSocket();
    io.to(userId).emit("excelProcessingStarted", {
      requestId,
      totalJobs,
    });

    // Process each row
    for (const row of sheetData) {
      try {
        if (!row.name || !row.rollNo || !row.department || !row.leetcodeUsername || !row.year || !row.batchName) {
          throw new Error("Missing required fields.");
        }
        await excelQueue.add(
          { ...row, requestId, userId },
          { removeOnComplete: true, removeOnFail: 50 }
        );
      } catch (error) {
        tracker.errors.push({ row, error: error.message });
        console.error(`Error processing row ${JSON.stringify(row)}:`, error.message);
      }
    }

    return { requestId, totalJobs };
  } catch (error) {
    console.error("Error processing file:", error.message);
    throw error;
  }
}

module.exports = { processExcelFile };