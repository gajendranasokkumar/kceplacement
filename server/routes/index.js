const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController");
const uploadRoutes = require("./uploadRoutes");
const dashboardRoutes = require("./dashboardRoutes");

router.get("/", homeController.getHome);
router.use("/upload", uploadRoutes);
router.use("/dashboard", dashboardRoutes); // Add dashboard routes

module.exports = router;
