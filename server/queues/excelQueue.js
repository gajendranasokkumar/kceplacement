const Queue = require("bull");
const { processStudentData } = require("../services/studentService");
const NotificationModel = require("../models/NotificationModel");
const { getSocket } = require("../socket");

const excelQueue = new Queue("studentQueue", {
  redis: { port: 6379, host: "127.0.0.1" }
});

const requestJobTracker = new Map(); // Track jobs by requestId

excelQueue.process(async (job) => {
  try {
    await processStudentData(job.data);
    console.log(`✅ Job ${job.id}: Student processed successfully.`);
  } catch (error) {
    console.error(`❌ Job ${job.id} failed with error: ${error.message}`);
    throw error;
  }
});

excelQueue.on("completed", async (job) => {
  const { requestId, userId } = job.data;

  // Ensure tracker exists for the requestId
  if (!requestJobTracker.has(requestId)) return;

  const tracker = requestJobTracker.get(requestId);
  tracker.completed++;

  // Check if all jobs (completed + failed) for the requestId are processed
  console.log('Completed:', tracker.completed, 'Failed:', tracker.errors.length, 'Total:', tracker.total);
  
  if (tracker.completed + tracker.errors.length === tracker.total) {
    try {
      // console.log(tracker.errors);
      const notification = await NotificationModel.create({
        userId,
        title: "Excel Processing Completed",
        message: `Processing completed: ${tracker.completed} succeeded, ${tracker.errors.length} failed.`,
        failureDocuments: tracker.errors,
      });
      console.log("Notification created:", notification._id);

      // Emit socket event
      const io = getSocket();
      io.to(userId).emit("excelProcessingComplete", {
        successCount: tracker.completed,
        errorCount: tracker.errors.length,
        errorRows: tracker.errors,
      });
    } catch (error) {
      console.error("Error creating notification:", error);
    } finally {
      requestJobTracker.delete(requestId); // Clean up tracker
    }
  }
});

excelQueue.on("failed", async (job, error) => {
  const { requestId, name, rollNo, department, leetcodeUsername, year, batchName } = job.data; // Extract the row data from the job

  // Ensure tracker exists for the requestId
  if (!requestJobTracker.has(requestId)) return;

  const tracker = requestJobTracker.get(requestId);
  console.log("Row data:", job.data); // Log the row data for debugging
  tracker.errors.push({ row: { name, rollNo, department, leetcodeUsername, year, batchName }, error: error.message }); // Include the row data in the error

  // Check if all jobs (completed + failed) for the requestId are processed
  console.log('Completed:', tracker.completed, 'Failed:', tracker.errors.length, 'Total:', tracker.total);

  if (tracker.completed + tracker.errors.length === tracker.total) {
    try {
      // console.log(tracker);
      const notification = await NotificationModel.create({
        userId: job.data.userId,
        title: "Excel Processing Completed",
        message: `Processing completed: ${tracker.completed} succeeded, ${tracker.errors.length} failed.`,
        failureDocuments: tracker.errors,
      });
      console.log("Notification created: -> ", notification._id);

      // Emit socket event
      const io = getSocket();
      io.to(job.data.userId).emit("excelProcessingComplete", {
        successCount: tracker.completed,
        errorCount: tracker.errors.length,
        errorRows: tracker.errors,
      });
    } catch (error) {
      console.error("Error creating notification:", error);
    } finally {
      requestJobTracker.delete(requestId); // Clean up tracker
    }
  }
});

module.exports = { excelQueue, requestJobTracker };