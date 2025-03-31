const Queue = require("bull");
const Redis = require("ioredis"); // Import ioredis for advanced Redis configuration
const { processStudentData } = require("../services/studentService");
const NotificationModel = require("../models/NotificationModel");
const { getSocket } = require("../socket");

// Configure Redis connection
const redisConnection = new Redis({
  port: 6379, // Default Redis port
  host: "oregon-redis.render.com", // Redis host (without protocol)
  username: "red-cu5k720gph6c73btg550", // Render Redis uses "default" as the username
  password: "gFaP987WJqMyu3CJCVdL4lqEYsigRzba", // Replace with your actual Redis password
  tls: {}, // Enables SSL/TLS for secure connection
  maxRetriesPerRequest: null, // Prevents retries for failed requests
  connectTimeout: 10000,
  reconnectOnError: (err) => {
    console.error("Redis connection error:", err.message);
    return true; // Reconnect on any Redis error
  },
});

// Initialize the Bull queue with the Redis connection
const excelQueue = new Queue("studentQueue", {
  redis: redisConnection, // Use the Redis connection options
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

  if (!requestJobTracker.has(requestId)) return;

  const tracker = requestJobTracker.get(requestId);
  tracker.completed++;

  if (tracker.completed + tracker.errors.length === tracker.total) {
    try {
      const notification = await NotificationModel.create({
        userId,
        title: "Excel Processing Completed",
        message: `Processing completed: ${tracker.completed} succeeded, ${tracker.errors.length} failed.`,
        failureDocuments: tracker.errors,
      });
      console.log("Notification created:", notification._id);

      const io = getSocket();
      io.to(userId).emit("excelProcessingComplete", {
        successCount: tracker.completed,
        errorCount: tracker.errors.length,
        errorRows: tracker.errors,
      });
    } catch (error) {
      console.error("Error creating notification:", error);
    } finally {
      requestJobTracker.delete(requestId);
    }
  }
});

excelQueue.on("failed", async (job, error) => {
  const { requestId, name, rollNo, department, leetcodeUsername, year, batchName } = job.data;

  if (!requestJobTracker.has(requestId)) return;

  const tracker = requestJobTracker.get(requestId);
  tracker.errors.push({ row: { name, rollNo, department, leetcodeUsername, year, batchName }, error: error.message });

  if (tracker.completed + tracker.errors.length === tracker.total) {
    try {
      const notification = await NotificationModel.create({
        userId: job.data.userId,
        title: "Excel Processing Completed",
        message: `Processing completed: ${tracker.completed} succeeded, ${tracker.errors.length} failed.`,
        failureDocuments: tracker.errors,
      });
      console.log("Notification created: -> ", notification._id);

      const io = getSocket();
      io.to(job.data.userId).emit("excelProcessingComplete", {
        successCount: tracker.completed,
        errorCount: tracker.errors.length,
        errorRows: tracker.errors,
      });
    } catch (error) {
      console.error("Error creating notification:", error);
    } finally {
      requestJobTracker.delete(requestId);
    }
  }
});

module.exports = { excelQueue, requestJobTracker };