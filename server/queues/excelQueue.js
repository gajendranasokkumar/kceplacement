const Queue = require("bull");
const { processExcelFile } = require("../services/excelService");

const excelQueue = new Queue("excelQueue", {
  redis: { port: 6379, host: "127.0.0.1" }, // Update Redis configuration if needed
});

// Process the queue
excelQueue.process(async (job) => {
  const { filePath, userId } = job.data;
  return await processExcelFile(filePath, userId);
});

module.exports = excelQueue;