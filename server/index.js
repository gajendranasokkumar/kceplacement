const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");
const { initSocket } = require("./socket");
const excelQueue = require("./queues/excelQueue");
const leetcodeRoutes = require("./routes/leetcodeRoutes");
const authRoutes = require("./routes/authRoutes");
const { verifyAdmin } = require("./middlewares/authMiddleware");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const http = require("http");
const server = http.createServer(app);

// Initialize socket.io
initSocket(server);

const dbURI = process.env.NODE_ENV === "production"
  ? process.env.MONGODB_URI_PRODUCTION
  : process.env.MONGODB_URI_LOCAL;

mongoose.connect(dbURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Protected routes
app.use("/upload", verifyAdmin, routes.uploadRoutes);
app.use("/dashboard", verifyAdmin, routes.dashboardRoutes);
app.use("/notifications", verifyAdmin, routes.notificationRoutes);
app.use("/students", verifyAdmin, routes.studentRoutes);
app.use("/companies", verifyAdmin, routes.companyRoutes);

// Public routes
app.use("/auth", authRoutes);
app.use("/leetcode", leetcodeRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
