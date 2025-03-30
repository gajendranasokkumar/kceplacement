const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");

router.get("/batches", uploadController.getBatches);
router.post("/batches", uploadController.addBatch);
router.delete("/batches/:id", uploadController.deleteBatch);

router.get("/classes", uploadController.getClasses);
router.post("/classes", uploadController.addClass);
router.delete("/classes/:id", uploadController.deleteClass);

router.get("/sections", uploadController.getSections);
router.post("/sections", uploadController.addSection);
router.delete("/sections/:id", uploadController.deleteSection);

module.exports = router;