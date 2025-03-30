const express = require("express");
const multer = require("multer");
const excelQueue = require("../queues/excelQueue");

const router = express.Router();
const uploadController = require("../controllers/uploadController");
const upload = multer({ dest: "uploads/" }); // Save files to "uploads" folder

router.get("/batches", uploadController.getBatches);
router.get("/years", uploadController.getYears);
router.post("/batches", uploadController.addBatch);
router.delete("/batches/:id", uploadController.deleteBatch);

router.get("/classes", uploadController.getClasses);
router.post("/classes", uploadController.addClass);
router.delete("/classes/:id", uploadController.deleteClass);

router.get("/sections", uploadController.getSections);
router.post("/sections", uploadController.addSection);
router.delete("/sections/:id", uploadController.deleteSection);

router.post("/upload-excel", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const userId = req.body.userId; // Pass userId from the frontend

  // Add the task to the Redis queue
  console.log("Adding to queue:", { filePath, userId });
  await excelQueue.add({ filePath, userId });

  res.status(202).json({ message: "File received. Processing in progress." });
});

module.exports = router;