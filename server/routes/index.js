const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController");
const uploadRoutes = require("./uploadRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const notificationRoutes = require("./notificationRoutes"); // Import notification routes
const studentRoutes = require("./studentRoutes");
const companyRoutes = require("./companyRoutes");

router.get("/", homeController.getHome);
router.use("/upload", uploadRoutes);
router.use("/dashboard", dashboardRoutes); // Add dashboard routes
router.use("/notifications", notificationRoutes); // Add notification routes
router.use("/students", studentRoutes); // Add student routes
router.use("/companies", companyRoutes); // Add company routes

module.exports = router;
