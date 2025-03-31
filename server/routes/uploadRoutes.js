const express = require("express");
const multer = require("multer");
const { processExcelFile } = require("../services/excelService"); // Ensure correct import

const router = express.Router();
const uploadController = require("../controllers/uploadController");
const storage = multer.memoryStorage();

const upload = multer({ storage });

router.get("/batches", uploadController.getBatches);
router.post("/batches", uploadController.addBatch);
router.delete("/batches/:id", uploadController.deleteBatch);

router.get("/years", uploadController.getYears);

router.get("/departments", uploadController.getDepartments);
router.post("/departments", uploadController.getDepartments);

router.get("/classes", uploadController.getClasses);
router.post("/classes", uploadController.addClass);
router.delete("/classes/:id", uploadController.deleteClass);

router.get("/sections", uploadController.getSections);
router.post("/sections", uploadController.addSection);
router.delete("/sections/:id", uploadController.deleteSection);

router.post("/upload-excel", upload.single("file"), async (req, res) => {
  const fileBuffer = req.file.buffer;
  const fileName = req.file.originalname;
  const userId = req.body.userId; // Pass userId from the frontend

  try {
    // Process the file and add jobs to the queue
    const { successCount, errorCount, errorRows } = await processExcelFile(fileBuffer, userId);

    res.status(202).json({
      message: "File processed and jobs added to the queue.",
      successCount,
      errorCount,
      errorRows,
    });
  } catch (error) {
    console.error("Error processing file:", error.message);
    res.status(500).json({ error: "Failed to process the file." });
  }
});

module.exports = router;